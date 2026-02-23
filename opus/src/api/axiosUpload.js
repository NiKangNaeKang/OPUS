import axios from "axios";
import { useAuthStore } from "../components/auth/useAuthStore";

/**
 * 업로드 전용 axios 인스턴스 (multipart/form-data)
 * - axiosApi는 application/json 헤더 고정이라 업로드에 부적합
 */
const axiosUpload = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosUpload.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Content-Type은 FormData일 때 axios가 boundary 포함해 자동 설정함
    return config;
  },
  (error) => Promise.reject(error)
);

axiosUpload.interceptors.response.use(
  (response) => response,
  (error) => {
    // axiosApi와 동일한 401 처리
    if (error?.response?.status === 401) {
      const url = error.config?.url || "";

      if (!url.includes("/auth/login") && !url.includes("/auth/google")) {
        useAuthStore.getState().logout();

        const serverMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message ||
              "세션이 만료되었습니다. 다시 로그인해주세요.";

        alert(serverMsg);
        window.location.href = "/";
        return new Promise(() => {});
      }
    }

    return Promise.reject(error);
  }
);

export default axiosUpload;