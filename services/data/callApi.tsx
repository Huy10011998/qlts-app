import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config/api";

type Conditions = {
  property: string;
  operator: number;
  value: string;
  type: number;
};

export const getList = async (
  nameCLass: string,
  orderby: string,
  pageSize: number,
  skipSize: number,
  conditions: Conditions[],
  conditionsAll: Conditions[]
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const config = {
      method: "POST" as const,
      url: `${BASE_URL}/${nameCLass}/get-list`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      data: {
        orderby,
        pageSize,
        skipSize,
        conditions,
        conditionsAll,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error(`GetList ${nameCLass} API error:`, error);
    throw error;
  }
};

export const getFieldActive = async (iD_Class_MoTa: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const config = {
      method: "POST" as const,
      url: `${BASE_URL}/Common/get-fields-active`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      data: {
        iD_Class_MoTa,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error("GetList May Tinh API error:", error);
    throw error;
  }
};

export const getPropertyClass = async (nameClass: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const config = {
      method: "POST" as const,
      url: `${BASE_URL}/Common/get-class-by-name`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      data: {
        nameClass,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error("GetList May Tinh API error:", error);
    throw error;
  }
};
