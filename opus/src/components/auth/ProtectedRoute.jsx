import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [isHydrated, setIsHydrated] = useState(false);

  // 로컬스토리지 데이터 복구 확인
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setIsHydrated(true);
    return () => unsub();
  }, []);

  // 인증 체크 및 리다이렉트
  useEffect(() => {
     //새로고침시 로그인정보 있는데도 튕김 방지
    if (!isHydrated) return;

    if (!token) {
      const isLoggingOut = sessionStorage.getItem("isLoggingOut");

      if (!isLoggingOut) {
        // 중복 방지를 위해 auth-fail 아이디가 없을 때만 토스트 출력(광클시 동일토스트 차단)
        if (!toast.isActive("auth-fail")) {
          toast.error("로그인이 필요한 서비스입니다.", { 
            icon: false, 
            toastId: "auth-fail" 
          });
        }
      } else {
        sessionStorage.removeItem("isLoggingOut");
      }

      navigate("/", { replace: true });
    }
  }, [token, navigate, isHydrated]);

  // 데이터 로딩 중이거나 비인증 시 렌더링 차단
  if (!isHydrated || !token) return null;

  return children;
}