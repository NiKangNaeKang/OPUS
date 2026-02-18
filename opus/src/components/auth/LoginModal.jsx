// src/components/auth/LoginModal.jsx
import { useEffect, useMemo, useState } from "react";
import "../../css/loginModal.css";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";
import { getSavedEmail } from "./rememberId";
import GoogleLoginButton from "./GoogleLoginButton";
import SocialRegisterForm from "./SocialRegisterForm";
import { useAuthValidation } from "./useAuthValidation"; // 1. 훅 임포트

export default function LoginModal({ open, onClose, onSwitchSignup }) {
  const doLogin = useAuthStore((s) => s.login);

  // --- 기존 로그인 관련 상태 ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // --- 소셜 가입 및 훅 연결 ---
  const [isSocialRegister, setIsSocialRegister] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // 2. 훅에서 하이픈 로직과 중복확인 상태 가져오기
  const { 
    isTelChecked, 
    setIsTelChecked, 
    handleCheckTel, 
    handlePhoneChange 
  } = useAuthValidation();

  const [telMsg, setTelMsg] = useState("");

  const canSubmit = useMemo(() => {
    if (isSocialRegister) return isTelChecked && phoneNumber.length >= 12 && !loading; // 하이픈 포함 12~13자
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
  }, [open, isSocialRegister, setIsTelChecked]);

  // 연락처 변경 시 메시지 초기화
  useEffect(() => {
    if (!open) return;
    setTelMsg("");
  }, [phoneNumber, open]);

  // 중복 확인 처리
  const onInternalCheckTel = async () => {
    const success = await handleCheckTel(phoneNumber);
    if (success) {
      setTelMsg("사용 가능한 연락처입니다.");
    } else {
      setTelMsg("이미 등록되었거나 올바르지 않은 번호입니다.");
    }
  };

  const handleGoogleLoginSuccess = (data) => {
    if (data?.message === "ADDITIONAL_INFO_REQUIRED") {
      setEmail(data.email);
      setIsSocialRegister(true);
      toast.info("가입을 위해 연락처 등록이 필요합니다.");
      return;
    }
    if (data?.success && data?.token) {
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
        // 하이픈 제거 후 순수 숫자로만 서버 전송
        const rawPhone = phoneNumber.replace(/[^0-9]/g, "");
        const res = await axiosApi.post("/auth/google/register", {
          memberEmail: email,
          memberTel: rawPhone,
        });

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
            <SocialRegisterForm
              email={email}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              isTelChecked={isTelChecked}
              telMsg={telMsg}
              onCheckTel={onInternalCheckTel}
              handlePhoneChange={handlePhoneChange}
            />
          ) : (
            <>
              <label className="lm-label">이메일
                <input className="lm-input" type="email" placeholder="example@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label className="lm-label">비밀번호
                <input className="lm-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>

              {/* 아이디 저장 체크박스 복구 */}
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

              {/* 하단 회원가입 링크 복구 */}
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