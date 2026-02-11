import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useAuthStore } from "./useAuthStore";
import { toast } from "react-toastify";

export default function HeaderModal() {
  const [modalType, setModalType] = useState(null); 
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleIconClick = () => {
   
    if (isLoggedIn) {
      navigate("/mypage");
      setModalType(null); 
    } else {
      setModalType("login");
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      // 1. "나 지금 직접 로그아웃 하는 중이야!" 라고 표시를 남깁니다.
      sessionStorage.setItem("isLoggingOut", "true");

      // 2. 모든 토스트를 일단 끄고
      toast.dismiss(); 

      // 3. 로그아웃 상태 업데이트 (토큰 삭제)
      logout();

      // 4. 즉시 메인으로 이동(스택아닌 교체)
      navigate("/", { replace: true });

      toast.success("로그아웃되었습니다.", { 
        icon: false,
        toastId: "logout-success"
      });
    }
  };

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn} 
        onClickUser={handleIconClick} 
        onLogout={handleLogout} 
      />
      
      <LoginModal 
        open={modalType === "login"} 
        onClose={() => setModalType(null)} 
        onSwitchSignup={() => setModalType("signup")} 
      />

      <SignupModal 
        open={modalType === "signup"} 
        onClose={() => setModalType(null)} 
      />
    </>
  );
}