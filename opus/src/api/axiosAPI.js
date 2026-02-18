import axios from "axios";
import { useAuthStore } from "../components/auth/useAuthStore";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* 요청 인터셉터: 서버로 요청을 보내기 전 실행 */
axiosApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* 응답 인터셉터: 서버 응답을 받은 후 처리 */
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401(Unauthorized) 에러 발생 시
    if (error?.response?.status === 401) {
      const url = error.config?.url || "";
      
      // 로그인/구글로그인 시도 중 발생하는 401은 인터셉터가 가로채지 않음 (로그인 실패 처리용)
      if (!url.includes("/auth/login") && !url.includes("/auth/google")) {
        
        // 1. 클라이언트 인증 정보 초기화
        useAuthStore.getState().logout();

        // 2. 에러 메시지 추출 (문자열이면 그대로, 객체면 message 필드 사용)
        const serverMsg = typeof error.response.data === 'string' 
                          ? error.response.data 
                          : (error.response.data?.message || "세션이 만료되었습니다. 다시 로그인해주세요.");
        
        alert(serverMsg);

        window.location.href = "/";

        // 이후 컴포넌트 로직이 실행되지 않도록 중단
        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export { axiosApi };
export default axiosApi;