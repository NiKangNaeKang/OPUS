import { useEffect, useMemo, useState } from "react";
import "../../css/loginModal.css";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";
import { getSavedEmail } from "./rememberId";

export default function LoginModal({ open, onClose, onSwitchSignup }) {
  const doLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setErrorMsg("");
      setLoading(false);
      return;
    }

    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveId(true);
    } else {
      setEmail("");
      setSaveId(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosApi.post(`/auth/login?saveId=${saveId}`, {
        memberEmail: email.trim(),
        memberPw: password.trim(),
      });

      const token = res?.data?.token;
      const member = res?.data?.member;

      if (!token || !member?.memberNo) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }

      const userName = member.memberEmail.split("@")[0];
      toast.success(<>{userName}님,<br />환영합니다!</>,{ icon: false });

      doLogin({ token, member });
      onClose?.();
    } catch (err) {
      const status = err?.response?.status;
      const serverData = err?.response?.data;

      if (status === 401) {
        setErrorMsg(typeof serverData === "string" ? serverData : "이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMsg(
          typeof serverData === "string"
            ? serverData
            : serverData?.message || err?.message || "로그인에 실패했습니다. 다시 시도해주세요."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="lm-overlay" role="dialog" aria-modal="true">
      <div className="lm-modal">
        <div className="lm-header">
          <h2 className="lm-title">로그인</h2>
          <button className="lm-close" type="button" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <form className="lm-body" onSubmit={handleSubmit}>
          <label className="lm-label">
            이메일
            <input
              className="lm-input"
              type="email"
              autoComplete="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </label>

          <label className="lm-label">
            비밀번호
            <input
              className="lm-input"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </label>

          <div className="lm-options" style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              id="saveId"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="saveId" style={{ fontSize: "14px", cursor: "pointer" }}>아이디 저장</label>
          </div>

          {errorMsg ? <p className="lm-error">{errorMsg}</p> : null}

          <button className="lm-submit" type="submit" disabled={!canSubmit}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="lm-footer">
            <button type="button" className="lm-link">
              아이디 찾기
            </button>
            <button type="button" className="lm-link">
              비밀번호 찾기
            </button>
            <button type="button" className="lm-link" onClick={onSwitchSignup}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}