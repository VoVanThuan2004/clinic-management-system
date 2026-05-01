import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";
import { message } from "antd";

export type FailedRequest = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Tránh loop vô hạn khi refresh token cũng bị lỗi
    if (originalRequest.url?.includes("/auth/refreshToken")) {
      tokenStorage.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Xử lý các status khác trước khi xử lý 401
    if (error.response) {
      const { status, data } = error.response;

      // Xử lý các lỗi không cần refresh token
      switch (status) {
        case 400:
          // console.error("Bad Request:", data?.message || "Invalid request");
          message.error(data?.message || "Invalid request");
          break;
        case 403:
          // console.error("Forbidden:", data?.message || "Access denied");
          message.error("You are not accessed into this resource");
          tokenStorage.clear();
          window.location.href = "/login";
          break;
        case 404:
          // console.error("Not Found:", data?.message || "Resource not found");
          message.error(data?.message || "Resource not found");
          break;
        case 409:
          console.error("Conflict:", data?.message || "Data conflict");
          message.error(data?.message || "Data conflict");
          break;
        case 422:
          console.error("Validation Error:", data?.message || "Invalid data");
          break;
        case 429:
          console.error("Too Many Requests:", "Please try again later");
          message.error("Too many requests. Please try again later");
          break;
        case 500:
          message.error('Server error. Please try again later');
          break;
        case 502:
        case 503:
          console.error(
            "Server Error:",
            data?.message || "Internal server error",
          );
          break;
      }
    }

    // Xử lý lỗi 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu không có refresh token thì redirect luôn
      const refreshToken = getCookie("refreshToken"); // Hàm lấy cookie
      if (!refreshToken) {
        tokenStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Đang refresh, queue request lại
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/v1/refresh-token`,
          {},
          {
            withCredentials: true, // Gửi kèm cookie
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        // Kiểm tra response format
        if (res.data?.status === "success" && res.data?.data?.accessToken) {
          const newAccessToken = res.data.data.accessToken;

          // Lưu access token mới
          tokenStorage.setAccessToken(newAccessToken);

          // Update default header
          axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          // Process queue với token mới
          processQueue(null, newAccessToken);

          // Retry request gốc
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } else {
          throw new Error("Invalid refresh token response");
        }
      } catch (refreshError) {
        // Refresh token thất bại
        console.error("Refresh token failed:", refreshError);

        // Process queue với lỗi
        processQueue(refreshError, null);

        // Clear all tokens
        tokenStorage.clear();

        // Xóa cookie refresh token (bằng cách set maxAge=0)
        document.cookie = "refreshToken=; path=/; max-age=0";

        // Redirect về login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Xử lý lỗi network timeout
    if (error.code === "ECONNABORTED" || error.message === "timeout") {
      console.error("Request timeout:", originalRequest.url);
      // Có thể hiển thị notification
    }

    // Xử lý lỗi network (mất kết nối)
    if (error.message === "Network Error") {
      console.error("Network error: Cannot connect to server");
      // Có thể hiển thị notification hoặc retry logic
    }

    return Promise.reject(error);
  },
);

// Helper function để lấy cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}
