import axios from "axios";
import { useAuthStore } from "../components/auth/useAuthStore";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * 요청 인터셉터: 서버로 요청을 보내기 전 실행
 */
axiosApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터: 서버 응답을 받은 후 컴포넌트에 전달되기 전 실행
 */
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const config = error.config || {};
      const url = config.url || "";
      const isLoginRequest = url.includes("/auth/login");

      if (!isLoginRequest) {
        useAuthStore.getState().logout();

        const serverMsg =
          error.response.data?.message ||
          "세션이 만료되었습니다. 다시 로그인해주세요.";
        alert(serverMsg);

        window.location.href = "/";

        // 이동 중이므로 이후 처리 중단(Optional)
        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export { axiosApi };
export default axiosApi;
