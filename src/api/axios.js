import axios from "axios";
import { useLoadingStore } from "@/store/useLoadingStore";
import { getActivePinia } from "pinia";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 기존 환경변수명 유지!
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token),
  );
  failedQueue = [];
};

instance.interceptors.request.use(
  (config) => {
    if (getActivePinia()) {
      useLoadingStore().setLoading(true);
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // 기존 방식 유지!
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    if (getActivePinia()) {
      useLoadingStore().setLoading(false);
    }
    return response;
  },
  async (error) => {
    if (getActivePinia()) {
      useLoadingStore().setLoading(false);
    }

    const status = error.response?.status;
    const originalRequest = error.config;

    // 401 → 토큰 갱신 시도
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await instance.post("/auth/reissue", { refreshToken });
        const newToken = res.data.accessToken;
        localStorage.setItem("token", newToken);
        processQueue(null, newToken);
        return instance(originalRequest);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    if (status === 500) {
      alert("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }

    return Promise.reject(error);
  },
);

export default instance;
