import { API_ENDPOINTS, BASE_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import Toast from "react-native-toast-message";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "expo-router";

// TYPES
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  setRefreshToken: (refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
}

interface JwtPayload {
  exp: number;
}

// AUTH CONTEXT
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const setToken = async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem("token", token);
    } else {
      await AsyncStorage.removeItem("token");
    }
  };

  const setRefreshToken = async (refreshToken: string | null) => {
    if (refreshToken) {
      await AsyncStorage.setItem("refreshToken", refreshToken);
    } else {
      await AsyncStorage.removeItem("refreshToken");
    }
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "refreshToken"]);
    router.replace("/");
  };

  useEffect(() => {
    (async () => {
      const token = await getValidToken();
      if (!token) router.replace("/");
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{ token: null, setToken, setRefreshToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải được sử dụng trong AuthProvider");
  return context;
};

// TOKEN UTILS
export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expiryTime = decoded.exp * 1000;
    const isExpired = Date.now() >= expiryTime - 30000; // 30s trước khi hết hạn
    return isExpired;
  } catch (err) {
    console.error("[isTokenExpired] Decode failed:", err);
    return true;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem("token"),
    AsyncStorage.getItem("refreshToken"),
  ]);

  if (!accessToken || !refreshToken) {
    console.warn("[getValidToken] Missing token or refreshToken");
    return null;
  }

  if (!isTokenExpired(accessToken)) {
    return accessToken;
  }

  return await refreshTokenPair(refreshToken);
};

// REFRESH TOKEN
const refreshTokenPair = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
      value: refreshToken,
    });

    const data = response?.data?.data; // <- lấy đúng data
    if (!data) {
      console.error("[refreshTokenPair] No data field in response");
      return null;
    }

    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    if (!newAccessToken) {
      console.error("[refreshTokenPair] No new accessToken, cannot save");
      return null;
    }

    await AsyncStorage.setItem("token", newAccessToken);
    if (newRefreshToken)
      await AsyncStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (error: any) {
    console.error(
      "[refreshTokenPair] Refresh failed:",
      error?.response?.data || error.message
    );

    await AsyncStorage.multiRemove(["token", "refreshToken"]);

    Toast.show({
      type: "error",
      text1: "Phiên đăng nhập hết hạn",
      text2: "Vui lòng đăng nhập lại.",
      position: "bottom",
    });

    return null;
  }
};

// AXIOS CONFIG
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

// REFRESH QUEUE
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const notifySubscribers = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

// REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {
  const accessToken = await getValidToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    console.warn(
      "[Response Error] URL:",
      originalRequest?.url,
      "| Status:",
      error.response?.status,
      "| Data:",
      error.response?.data
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await getValidToken();
        isRefreshing = false;

        if (!newToken) {
          console.error("[Response Error] Cannot refresh token");
          throw new Error("Không thể làm mới token");
        }

        notifySubscribers(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("[Response Error] Refresh failed:", err);
        isRefreshing = false;
        refreshSubscribers = [];

        Toast.show({
          type: "error",
          text1: "Phiên đăng nhập đã hết hạn",
          text2: "Vui lòng đăng nhập lại.",
          position: "bottom",
        });

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
