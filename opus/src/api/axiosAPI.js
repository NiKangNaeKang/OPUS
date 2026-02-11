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
    // Zustand 스토어에서 최신 토큰 가져오기
    const token = useAuthStore.getState().token;

    // 토큰이 존재하면 Authorization 헤더에 Bearer 토큰 주입
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터: 서버 응답을 받은 후 컴포넌트에 전달되기 전 실행
 */
axiosApi.interceptors.response.use(
  (response) => {
    // 2xx 범위의 상태 코드는 이 함수가 실행됨
    return response;
  },
  (error) => {
    // 2xx 외의 상태 코드는 이 함수가 실행됨
    if (error.response && error.response.status === 401) {
      
      const config = error.config;
      // 로그인 시도(/auth/login) 중 발생한 401은 단순 인증 실패이므로 페이지 이동을 막음
      const isLoginRequest = config.url.includes('/auth/login');

      if (!isLoginRequest) {
        // 1. 상태 관리 스토어의 데이터 비우기 (로그아웃 처리)
        useAuthStore.getState().logout();

        // 2. 사용자에게 알림
        const serverMsg = error.response.data?.message || "세션이 만료되었습니다. 다시 로그인해주세요.";
        alert(serverMsg);

        // 3. 메인 또는 로그인 페이지로 강제 이동
        // navigate는 컴포넌트 내부에서만 사용 가능하므로, 외부 파일인 여기서는 window.location 사용
        window.location.href = "/";
        
        // 이동 중이므로 에러 반환 중단 (Optional)
        return new Promise(() => {}); 
      }
    }

    // 그 외의 에러나 로그인 실패 에러는 컴포넌트의 catch 블록으로 전달
    return Promise.reject(error);
  }
);

export { axiosApi };
export default axiosApi;