import axios, { AxiosError, AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { API_ENDPOINTS, BASE_URL } from "@/config";

// Biến global để tránh gọi refresh token nhiều lần cùng lúc
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Hàm thông báo cho tất cả request chờ khi có token mới
const onRrefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Hàm gọi refresh token
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Không tìm thấy refreshToken");

    const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Lưu token mới
    await AsyncStorage.setItem("token", accessToken);
    if (newRefreshToken) {
      await AsyncStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    if (__DEV__) console.error("Refresh token thất bại:", error);
    throw error;
  }
};

// Tạo axios instance riêng
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL, // <-- nhớ config trong config.ts
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

// Add request interceptor → luôn gắn accessToken
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor → xử lý 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh → chờ token mới
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onRrefreshed(newToken);

        // Retry request với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];

        // Xoá token + điều hướng login
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const apiCall = async (
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body: any = {}
) => {
  try {
    // Lấy token từ SecureStore
    const token = await SecureStore.getItemAsync("token");

    const response = await api({
      method,
      url: endpoint,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      data: method === "POST" ? body : undefined,
    });

    return response.data;
  } catch (error) {
    console.error("API Call Error:", error);
    throw error;
  }
};

export default api;
