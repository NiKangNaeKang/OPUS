import { useEffect, useMemo, useState } from "react";
import "../../css/loginModal.css";
import axiosApi from "../../api/axiosAPI";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";

export default function LoginModal({ open, onClose, onSwitchSignup }) {
  const doLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 제출 가능 여부 체크 (이메일/비번 입력됨 + 로딩 중 아님)
  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  // 모달이 닫힐 때 상태값 초기화
  useEffect(() => {
    if (!open) return;
    setEmail("");
    setPassword("");
    setErrorMsg("");
    setLoading(false);
  }, [open]);

  // 모달 오픈 시 배경 스크롤 방지
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // 로그인 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosApi.post("/auth/login", {
        memberEmail: email.trim(),
        memberPw: password.trim(),
      });

      const accessToken = res?.data?.token || res?.data?.accessToken;
      const user = res?.data?.user;

      if (!accessToken || !user?.id || !user?.role) {
        throw new Error("로그인 응답 형식이 올바르지 않습니다.");
      }

      // `${user.memberName || "회원"}님, 환영합니다!` <수정!!!!!!!!!!!!
      toast.success("환영합니다!", {icon: false});

      doLogin({ token: accessToken, user });
      onClose?.();
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        setErrorMsg("이메일 또는 비밀번호가 틀렸습니다.");
      } else {
        const serverMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;

        setErrorMsg(serverMsg || "로그인에 실패했습니다. 다시 시도해주세요.");
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
          <button
            className="lm-close"
            type="button"
            onClick={onClose}
            aria-label="닫기"
          >
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
            <button type="button" className="lm-link">아이디 찾기</button>
            <button type="button" className="lm-link">비밀번호 찾기</button>
            <button type="button" className="lm-link" onClick={onSwitchSignup}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}