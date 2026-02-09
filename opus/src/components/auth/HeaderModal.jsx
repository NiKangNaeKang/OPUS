import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useAuthStore } from "./useAuthStore";

export default function HeaderModal() {
  const [modalType, setModalType] = useState(null); 
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleIconClick = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      setModalType("login");
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logout();
      navigate("/");
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