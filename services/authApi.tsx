import axios from "axios";
import { md5Hash } from "../utils/hash";
import { API_ENDPOINTS } from "@/config";

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
