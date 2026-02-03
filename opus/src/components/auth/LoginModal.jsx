import { useEffect, useMemo, useState } from "react";
import "../../css/loginModal.css";

import api from "../../api/axiosAPI";
import { useAuthStore } from "./useAuthStore";

export default function LoginModal({ open, onClose }) {
  const doLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  useEffect(() => {
    if (!open) return;
    setEmail("");
    setPassword("");
    setErrorMsg("");
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const accessToken = res?.data?.accessToken;
      const user = res?.data?.user;

      if (!accessToken || !user?.id || !user?.role) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }

      doLogin({ token: accessToken, user });

      onClose?.();
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message;

      setErrorMsg(serverMsg || "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="lm-overlay" 
      onClick={handleOverlayClick} 
      role="dialog" 
      aria-modal="true"
    >
      <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
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

          {errorMsg ? <p className="lm-error">{errorMsg}</p> : null}

          <button className="lm-submit" type="submit" disabled={!canSubmit}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="lm-footer">
            <button type="button" className="lm-link">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  );
}