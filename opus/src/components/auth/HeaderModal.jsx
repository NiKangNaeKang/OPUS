import { useState } from "react";
import Header from "../common/Header";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import { useAuthStore } from "./useAuthStore";

export default function HeaderModal() {
  // null: 닫힘, "login": 로그인창, "signup": 회원가입창
  const [modalType, setModalType] = useState(null); 
  
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleIconClick = () => {
    if (isLoggedIn) {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        logout();
      }
    } else {
      setModalType("login");
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onClickUser={handleIconClick} />
      
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