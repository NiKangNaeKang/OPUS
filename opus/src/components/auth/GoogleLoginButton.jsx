import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import axiosApi from "../../api/axiosAPI";
import { toast } from "react-toastify";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // 콘솔 로그는 개발 완료 후 삭제하거나 유지하세요.
      console.log("Google Auth Success:", tokenResponse);

try {
    const response = await axiosApi.post("/auth/google", {
      accessToken: tokenResponse.access_token,
    });

    const data = response.data;

    // 1. 신규 회원이라 추가 정보(연락처)가 필요한 경우
    if (data.success === false && data.message === "ADDITIONAL_INFO_REQUIRED") {
      toast.info("회원가입을 완료하기 위해 연락처 등록이 필요합니다.");
      
      // 연락처를 입력받을 모달을 띄우거나, 가입 페이지로 이메일 정보를 들고 이동합니다.
      navigate("/signup/extra", { state: { email: data.email } }); 
      return;
    }

    // 2. 기존 회원이라 로그인이 성공한 경우
    if (data.success && data.token) {
      // 백엔드에서 준 구조 그대로 login 함수에 전달 ({ token, member })
      login({ 
        token: data.token, 
        member: data.member 
      });
      
      toast.success("로그인에 성공했습니다!");
      navigate("/");
    }

  } catch (error) {
    console.error("구글 로그인 에러:", error);
    toast.error(error.response?.data || "로그인 중 오류가 발생했습니다.");
      }
    },
    onError: (error) => {
      console.error("Google Login Window Error:", error);
      toast.error("구글 인증 창을 여는 데 실패했습니다.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        width: "100%",
        padding: "12px",
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        color: "#3c4043",
        transition: "background-color 0.2s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
    >
      <img
        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
        alt=""
        style={{ width: "20px", height: "20px" }}
      />
      <span>구글로 로그인하기</span>
    </button>
  );
};

export default GoogleLoginButton;