import { axiosApi } from "../axiosApi";
import { useAuthStore } from "../store/useAuthStore";

// 요청 보낼 때마다: 토큰 자동 첨부
axiosApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 응답 받을 때: 401이면 로그아웃 + 로그인 이동
axiosApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export const api = axiosApi;