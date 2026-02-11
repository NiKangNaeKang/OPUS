import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "./useAuthStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // 로그아웃 버튼을 눌러서 발생한 상황인지 확인
      const isLoggingOut = sessionStorage.getItem("isLoggingOut");

      if (isLoggingOut) {
        // 의도적인 로그아웃이면 토스트 없이 플래그만 제거
        sessionStorage.removeItem("isLoggingOut");
      } else {
        // 직접 주소 입력 등으로 들어온 거라면 토스트 출력
        toast.error("로그인이 필요한 서비스입니다.", { 
          icon: false,
          toastId: "auth-fail" // main.jsx의 StrictMode로 2번 실행돼 토스트 2번 뜨는거 방지
        });
      }

      const timer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 0); 

      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  if (!token) return null;

  return children;
}