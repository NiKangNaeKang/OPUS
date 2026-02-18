import { useGoogleLogin } from "@react-oauth/google";
import axiosApi from "../../api/axiosAPI";
import { toast } from "react-toastify";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Auth Success:", tokenResponse);
      const toastId = toast.loading("구글 계정 정보 확인 중...");

      try {
        const response = await axiosApi.post("/auth/google", {
          accessToken: tokenResponse.access_token,
        });

        console.log("Server Response:", response.data);
        toast.dismiss(toastId);

        // 부모(LoginModal)의 handleGoogleLoginSuccess 실행
        if (onLoginSuccess) {
          onLoginSuccess(response.data);
        }
      } catch (error) {
        toast.dismiss(toastId);
        console.error("구글 로그인 서버 에러:", error);
        toast.error(error.response?.data?.message || "서버 통신에 실패했습니다.");
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
    className="lm-submit lm-google"
    onClick={() => handleGoogleLogin()}
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