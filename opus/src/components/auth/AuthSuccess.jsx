import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import axiosApi from "../../api/axiosAPI";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      alert("로그인에 실패했습니다.");
      navigate("/");
      return;
    }

    // token으로 member 정보 조회 후 함께 저장
    axiosApi.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        login({ token, member: res.data });
        navigate("/board/list/1");
      })
      .catch(() => {
        alert("로그인에 실패했습니다.");
        navigate("/");
      });

  }, [searchParams, navigate, login]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>로그인 중입니다...</h2>
    </div>
  );
};

export default AuthSuccess;