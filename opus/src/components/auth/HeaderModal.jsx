import { useState } from "react";
import Header from "./Header";
import LoginModal from "../auth/LoginModal";

export default function HeaderContainer() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <Header onClickUser={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
