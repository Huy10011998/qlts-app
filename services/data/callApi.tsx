import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import { getValidToken } from "@/components/auth/AuthProvider";

type Conditions = {
  property: string;
  operator: number;
  value: string;
  type: number;
};

export type Field = {
  iD_Class: number;
  name: string;
  moTa: string;
  isShowGrid: boolean;
  isUnique: boolean;
  isRequired: boolean;
  isActive: boolean;
  typeProperty: number;
  maxLength: number;
  maxValue: number;
  minValue: number;
  referenceName: string;
  isMulti: boolean;
  stt: number;
  columnSize: number;
  columnNone: number;
  cascadeClearFields: string;
  parentsFields: string;
  groupLayout: string;
  isShowDetail: boolean;
  enumName: string;
  prefix: string;
  defaultValue: string;
  defaultDateNow: boolean;
  width: string;
  isReadOnly: boolean;
  stT_Grid: number;
  notShowReference: boolean;
  referenceNameMulti: string;
  referenceProperty: string;
  notShowSplit: boolean;
  isShowMobile: boolean;
  id: number;
  iD_Class_Name: string;
  typeProperty_MoTa: number;
};

export const getList = async (
  nameCLass: string,
  orderby: string,
  pageSize: number,
  skipSize: number,
  searchText: string,
  fields: Field[],
  conditions: Conditions[],
  conditionsAll: Conditions[]
) => {
  try {
    const token = await getValidToken();
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
        searchText,
        fields,
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
    const token = await getValidToken();
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
    const token = await getValidToken();

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

export const getDetails = async (nameCLass: string, id: number) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
    }

    const config = {
      method: "POST" as const,
      url: `${BASE_URL}/${nameCLass}/get-details`,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${token}`,
      },
      data: {
        id,
      },
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (__DEV__) console.error(`Get Details ${nameCLass} API error:`, error);
    throw error;
  }
};
