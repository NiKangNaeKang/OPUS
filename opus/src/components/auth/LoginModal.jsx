import { useEffect, useMemo, useState } from "react";
import "../../css/loginModal.css";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";
import { getSavedEmail } from "./rememberId";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginModal({ open, onClose, onSwitchSignup }) {
  const doLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- 소셜 가입 및 중복 확인 관련 상태 ---
  const [isSocialRegister, setIsSocialRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTelChecked, setIsTelChecked] = useState(false); // 중복 확인 통과 여부
  const [telMsg, setTelMsg] = useState(""); // 중복 확인 결과 메시지

  const canSubmit = useMemo(() => {
    if (isSocialRegister) return isTelChecked && phoneNumber.trim().length > 9 && !loading;
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading, isSocialRegister, phoneNumber, isTelChecked]);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setErrorMsg("");
      setLoading(false);
      setIsSocialRegister(false);
      setPhoneNumber("");
      setIsTelChecked(false);
      setTelMsg("");
      return;
    }
    const savedEmail = getSavedEmail();
    if (savedEmail && !isSocialRegister) {
      setEmail(savedEmail);
      setSaveId(true);
    }
  }, [open, isSocialRegister]);

  // 연락처 변경 시 중복 확인 상태 초기화
  useEffect(() => {
    setIsTelChecked(false);
    setTelMsg("");
  }, [phoneNumber]);

  // 연락처 중복 확인 함수
  const checkTelDuplicate = async () => {
    const telRegExp = /^010\d{8}$/;
    if (!telRegExp.test(phoneNumber)) {
      setTelMsg("하이픈(-) 제외, 010 포함 11자리 숫자로 입력해주세요.");
      return;
    }

    try {
      const res = await axiosApi.post(`/auth/check-tel`, {
        memberTel: phoneNumber
      });
      
      if (res.data === false) {
        setTelMsg("사용 가능한 연락처입니다.");
        setIsTelChecked(true);
      }
    } catch (err) {
      console.error("중복 확인 API 에러:", err);
      const status = err.response?.status;
      
      if (status === 409) {
        setTelMsg("이미 가입된 연락처입니다.");
        setIsTelChecked(false);
      } else {
        setTelMsg("중복 확인 중 오류가 발생했습니다.");
        setIsTelChecked(false);
      }
    }
  };

  const handleGoogleLoginSuccess = (data) => {
    if (data.message === "ADDITIONAL_INFO_REQUIRED") {
      setEmail(data.email);
      setIsSocialRegister(true);
      toast.info("가입을 위해 연락처 등록이 필요합니다.");
      return;
    }
    if (data.success && data.token) {
      handleLoginSuccess(data.token, data.member);
    }
  };

  const handleLoginSuccess = (token, member) => {
    const userName = member?.memberEmail?.split("@")[0] || "사용자";
    toast.success(<>{userName}님,<br />환영합니다!</>, { icon: false });
    doLogin({ token, member });
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErrorMsg("");

    try {
if (isSocialRegister) {
  // ✅ 구글 추가정보 가입은 google/register로
  const res = await axiosApi.post("/auth/google/register", {
    memberEmail: email,
    memberTel: phoneNumber,
  });

  // 서버가 가입 성공 후 토큰 + member까지 줌(너 백엔드가 그렇게 구현됨)
  if (res.data?.success && res.data?.token) {
    handleLoginSuccess(res.data.token, res.data.member);
  } else {
    toast.success("회원가입이 완료되었습니다.");
    setIsSocialRegister(false);
    onClose?.();
        }


      } else {
        const res = await axiosApi.post(`/auth/login?saveId=${saveId}`, {
          memberEmail: email.trim(),
          memberPw: password.trim(),
        });
        handleLoginSuccess(res.data.token, res.data.member);
      }
    } catch (err) {
      console.error("처리 에러:", err);
      const serverMsg = err.response?.data?.message || err.response?.data;
      setErrorMsg(typeof serverMsg === "string" ? serverMsg : "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="lm-overlay" role="dialog" aria-modal="true">
      <div className="lm-modal">
        <div className="lm-header">
          <h2 className="lm-title">{isSocialRegister ? "추가 정보 입력" : "로그인"}</h2>
          <button className="lm-close" type="button" onClick={onClose}>✕</button>
        </div>

        <form className="lm-body" onSubmit={handleSubmit}>
          {isSocialRegister ? (
            <>
              <p style={{ fontSize: "14px", marginBottom: "15px", color: "#666" }}>
                계정: <strong>{email}</strong>
              </p>
              <label className="lm-label">연락처</label>
              <div style={{ display: "flex", gap: "5px", marginBottom: "5px" }}>
                <input
                  className="lm-input"
                  type="tel"
                  placeholder="01012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{ flex: 1, marginBottom: 0 }}
                />
                <button 
                  type="button" 
                  onClick={checkTelDuplicate}
                  style={{ width: "80px", padding: "0 10px", fontSize: "12px", backgroundColor: "#333", color: "#fff", borderRadius: "4px" }}
                >
                  중복확인
                </button>
              </div>
              {telMsg && (
                <p style={{ fontSize: "12px", color: isTelChecked ? "blue" : "red", marginBottom: "15px" }}>
                  {telMsg}
                </p>
              )}
            </>
          ) : (
            <>
              <label className="lm-label">이메일
                <input className="lm-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="lm-label">비밀번호
                <input className="lm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
              <div className="lm-options" style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "15px" }}>
                <input type="checkbox" id="saveId" checked={saveId} onChange={(e) => setSaveId(e.target.checked)} />
                <label htmlFor="saveId" style={{ fontSize: "14px", cursor: "pointer" }}>아이디 저장</label>
              </div>
            </>
          )}

          {errorMsg && <p className="lm-error">{errorMsg}</p>}

          <button className="lm-submit" type="submit" disabled={!canSubmit}>
            {loading ? "처리 중..." : isSocialRegister ? "가입 완료" : "로그인"}
          </button>

          {!isSocialRegister && (
            <>
              <div className="lm-social-login" style={{ marginTop: "10px" }}>
                <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />
              </div>
              <div className="lm-footer">
                <button type="button" className="lm-link" onClick={onSwitchSignup}>회원가입</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}