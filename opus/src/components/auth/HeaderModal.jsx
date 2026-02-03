import { useState } from "react";
import Header from "../common/Header";
import LoginModal from "./LoginModal";
import { useAuthStore } from "./useAuthStore";

export default function HeaderModal() {
  const [loginOpen, setLoginOpen] = useState(false);
  
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleIconClick = () => {
    if (isLoggedIn) {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        logout();
      }
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onClickUser={handleIconClick} />
      
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}