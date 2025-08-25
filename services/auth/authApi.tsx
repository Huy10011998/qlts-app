import axios from "axios";
import { API_ENDPOINTS } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { md5Hash } from "@/utils/helper";

export const loginApi = async (userName: string, userPassword: string) => {
  try {
    const hashedPassword = await md5Hash(userPassword);

    const config = {
      method: "POST" as const,
      url: API_ENDPOINTS.LOGIN,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        userName,
        userPassword: hashedPassword,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error("Login API error:", error);
    throw error;
  }
};

export const changePasswordApi = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const hashedPassword = await md5Hash(oldPassword);
    const hashedNewPassword = await md5Hash(newPassword);

    const config = {
      method: "POST" as const,
      url: API_ENDPOINTS.CHANGE_PASSWORD,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      data: {
        oldPassword: hashedPassword,
        newPassword: hashedNewPassword,
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error("ChangePassword API error:", error);
    throw error;
  }
};
