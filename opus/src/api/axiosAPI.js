import axios from "axios";
import { useAuthStore } from "../components/auth/useAuthStore";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

/* 요청 인터셉터: 서버로 요청을 보내기 전 실행 */
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (status === 401) {
      // 로그인/소셜로그인 요청은 제외
      if (url.includes("/auth/login") || url.includes("/auth/google")) {
        return Promise.reject(error);
      }

      const token = useAuthStore.getState().token;

      // ✅ 토큰이 없으면: 비로그인 401 -> 만료 알림 X
      if (!token) {
        return Promise.reject(error);
      }

      // ✅ 토큰이 있어도 "자동 백그라운드성 호출"은 만료 알림에서 제외(선택)
      // 다음날 첫 진입 때 주로 터지는 애들
      const silent401Urls = ["/cart/merge"];
      if (silent401Urls.some((p) => url.includes(p))) {
        // 토큰이 만료됐을 수도 있으니 상태는 정리할지 선택:
        // 1) 그냥 조용히 넘기기(추천: UX 깔끔)
        return Promise.reject(error);

        // 2) 조용히 로그아웃만 하고 알림은 안 띄우기(원하면 이걸로)
        // useAuthStore.getState().logout();
        // return new Promise(() => {});
      }

      // ✅ 여기부터가 "진짜 만료" 처리
      const serverMsg =
        typeof error.response.data === "string"
          ? error.response.data
          : (error.response.data?.message || "세션이 만료되었습니다. 다시 로그인해주세요.");

      useAuthStore.getState().logout();
      alert(serverMsg);
      return new Promise(() => {});
    }

    return Promise.reject(error);
  }
);

export { axiosApi };
export default axiosApi;