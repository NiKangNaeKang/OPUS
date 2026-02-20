import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore(); // Zustand 스토어의 login 함수 가져오기

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // localStorage 대신 Zustand 스토어에 저장 (로그인 처리)
      login(token); 
      
      // 저장 후 이동
      navigate("/board/list/1"); 
    } else {
      alert("로그인에 실패했습니다.");
      navigate("/login");
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>로그인 처리 중입니다...</h2>
    </div>
  );
};

export default AuthSuccess;