import { useState, useEffect } from "react";
import "../../css/loginModal.css";
import axiosApi from "../../api/axiosAPI";

export default function SignupModal({ open, onClose }) {
  // 1. 입력 데이터 상태 관리
  const [formData, setFormData] = useState({
    memberEmail: "",
    memberPw: "",
    memberPwConfirm: "",
    memberTel: "",
  });

  // 2. 가입 절차 상태 관리
  const [authCode, setAuthCode] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      setAuthCode(""); 
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  // 모달 닫힐 때 데이터 초기화
  useEffect(() => {
    if (!open) {
      setFormData({
        memberEmail: "",
        memberPw: "",
        memberPwConfirm: "",
        memberTel: "",
      });
      setAuthCode("");
      setIsEmailChecked(false);
      setIsEmailSent(false);
      setIsEmailVerified(false);
      setIsTimerActive(false);
      setTimeLeft(300);
    }
  }, [open]);

  // 입력값 실시간 반영
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "memberTel") {
      // 숫자만 남기고 하이픈 삽입
      const cleaned = value.replace(/[^0-9]/g, "");
      let formatted = cleaned;
      if (cleaned.length > 3 && cleaned.length <= 7) {
        formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      } else if (cleaned.length > 7) {
        formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
      }
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "memberEmail") {
      setIsEmailChecked(false);
      setIsEmailSent(false);
      setIsEmailVerified(false);
      setIsTimerActive(false);
    }
  };

  const handleCheckEmail = async () => {
    if (!formData.memberEmail) return alert("이메일을 입력해주세요.");
    
    if (!emailRegex.test(formData.memberEmail)) {
      return alert("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
    }

    try {
      setLoading(true);
      const res = await axiosApi.post("/auth/check-email", {
        email: formData.memberEmail,
      });
      if (res.data === true) {
        alert("사용 중인 이메일입니다.");
        setIsEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setIsEmailChecked(true);
      }
    } catch (err) {
      alert("이메일 중복 확인에 실패했습니다. " + (err.response?.data || "잠시 후 다시 시도해 주세요."));
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!isEmailChecked) return alert("먼저 이메일 중복을 확인해주세요.");

    // 이중 체크: 전송 직전 형식 다시 확인
    if (!emailRegex.test(formData.memberEmail)) {
      return alert("올바른 이메일 형식이 아닙니다. 다시 확인해 주세요.");
    }

    try {
      setLoading(true);
      await axiosApi.post("/auth/email-send", { email: formData.memberEmail });
      alert("인증번호가 발송되었습니다.");
      setIsEmailSent(true);
      setTimeLeft(300);
      setIsTimerActive(true);
    } catch (err) {
      alert("인증번호 발송에 실패했습니다. " + (err.response?.data || "잠시 후 다시 시도해 주세요."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (timeLeft === 0) return; 

    try {
      const res = await axiosApi.post("/auth/email-verify", {
        email: formData.memberEmail,
        code: authCode,
      });
      if (res.data === true) {
        alert("인증에 성공했습니다.");
        setIsEmailVerified(true);
        setIsTimerActive(false);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("인증 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if (!pwRegex.test(formData.memberPw)) {
      return alert("비밀번호는 8~16자의 영문과 숫자를 혼합해야 합니다.");
    }
    if (!isEmailVerified) return alert("이메일 인증을 완료해주세요.");
    if (formData.memberPw !== formData.memberPwConfirm) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    setLoading(true);
    try {
      const cleanPhone = formData.memberTel.replace(/[^0-9]/g, "");
      await axiosApi.post("/auth/signup", {
        memberEmail: formData.memberEmail,
        memberPw: formData.memberPw,
        memberTel: cleanPhone,
      });
      alert("회원가입이 완료되었습니다!");
      onClose();
    } catch (err) {
      alert("회원가입에 실패했습니다. " + (err.response?.data?.message || "다시 확인해 주세요."));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="lm-overlay">
      <div className="lm-modal">
        <div className="lm-header">
          <h2 className="lm-title">회원가입</h2>
          <button className="lm-close" type="button" onClick={onClose}>✕</button>
        </div>

        <form className="lm-body" onSubmit={handleSubmit}>

          <label className="lm-label">
            이메일 주소
            <div className="lm-input-group">
              <input
                className="lm-input"
                style={{ flex: 1 }}
                name="memberEmail"
                type="email"
                placeholder="example@gmail.com"
                value={formData.memberEmail}
                onChange={handleChange}
                disabled={isEmailVerified}
                required
              />
              <button
                type="button"
                onClick={handleCheckEmail}
                className="lm-link"
                disabled={isEmailChecked || isEmailVerified || loading}
                style={{ color: isEmailChecked ? "green" : "" }}
              >
                {isEmailChecked ? "확인됨" : "중복확인"}
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                className="lm-link"
                disabled={!isEmailChecked || isEmailVerified || loading}
              >
                {isEmailSent ? "재발송" : "인증요청"}
              </button>
            </div>
          </label>

          {isEmailSent && !isEmailVerified ? (
            <label className="lm-label">
              인증번호 입력
              <div className="lm-input-group">
                <input
                  className="lm-input"
                  style={{ flex: 1 }}
                  type="text"
                  placeholder="6자리 숫자를 입력해주세요."
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  disabled={timeLeft === 0}
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className="lm-link"
                  disabled={timeLeft === 0}
                >
                  확인
                </button>
              </div>
              <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                {timeLeft > 0 
                  ? `남은 시간: ${formatTime(timeLeft)}` 
                  : "시간이 만료되었습니다. 인증번호를 다시 요청해주세요."}
              </p>
            </label>
          ) : null}

          {isEmailVerified ? (
            <p style={{ color: "blue", fontSize: "12px" }}>이메일 인증이 완료되었습니다.</p>
          ) : null}

          <label className="lm-label">
            비밀번호 (8~16자 영문/숫자 혼합)
            <input
              className="lm-input"
              name="memberPw"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={formData.memberPw}
              onChange={handleChange}
              required
            />
          </label>

          <label className="lm-label">
            비밀번호 확인
            <input
              className="lm-input"
              name="memberPwConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요."
              value={formData.memberPwConfirm}
              onChange={handleChange}
              required
            />

            {formData.memberPwConfirm.length > 0 ? (
              formData.memberPw === formData.memberPwConfirm ? (
                <p style={{ color: "blue", fontSize: "12px", marginTop: "5px" }}>
                  비밀번호가 일치합니다.
                </p>
              ) : (
                <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
                  비밀번호가 일치하지 않습니다.
                </p>
              )
            ) : null}
          </label>

          <label className="lm-label">
            연락처
            <input
              className="lm-input"
              name="memberTel"
              type="tel"
              placeholder="010-0000-0000"
              value={formData.memberTel}
              onChange={handleChange}
              required
            />
          </label>

          <button className="lm-submit" type="submit" disabled={loading || !isEmailVerified}>
            {loading ? "처리 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}