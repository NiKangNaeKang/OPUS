import axios from "axios";
import { useAuthStore } from "../components/auth/useAuthStore";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 요청인터셉터 : 서버로 요청보내기 전
axiosApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Zustand 스토어에서 현재 저장된 JWT 토큰 가져오기

      // HTTP 표준 헤더 규격에 맞춰 'Bearer {토큰}' 형태로 Authorization 헤더에 삽입
      // 백엔드의 JwtAuthenticationFilter에서 이 값을 읽어 인증을 처리함    
    if (token) {
      config.headers.Authorization =`Bearer ${token}`;
    }

    return config; // 설정이 완료된 요청 객체를 반환하여 서버로 전송 진행
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답인터셉터 : 서버에서 응답받고, 컴포넌트에 전달 전
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {

      // 현재 요청한 URL이 로그인 관련(/auth/)인지 확인
      const isAuthRequest = error.config.url.includes('/auth/');

      // 로그인/인증 관련 요청에서 발생한 401 에러시, 에러를 그대로 거절(reject) 반환
      if (isAuthRequest) {
        return Promise.reject(error);
      }

      // 로그인 요청이 아닌데 401인 경우에만 "만료" 알림 표시
      const serverMsg = error.response.data?.message || "로그인이 만료되었습니다. 다시 로그인해주세요.";
      alert(serverMsg);

      useAuthStore.getState().logout(); // 토큰 비움

    }
    return Promise.reject(error);
  }
);

export { axiosApi };
export default axiosApi;