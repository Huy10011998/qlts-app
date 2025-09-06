import * as Crypto from "expo-crypto";
import { TypeProperty } from "./enum";
import api from "@/components/auth/AuthProvider";
import { Field } from "@/types";

export const removeVietnameseTones = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

export async function md5Hash(input: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.MD5,
    input
  );
}

export const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const formatKeyProperty = (key: string) =>
  key.charAt(0).toLowerCase() + key.slice(1);

export const getFieldValue = (
  item: Record<string, any>,
  field: Field
): string => {
  if (!item || !field) return "--";

  const key =
    field.typeProperty === TypeProperty.Reference
      ? `${field.name}_MoTa`
      : field.name;

  return String(item[formatKeyProperty(key)] ?? "--");
};

export const callApi = async <T,>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: any
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error: any) {
    if (__DEV__) console.error(`[API ERROR] ${url}:`, error);

    // Toast.show({
    //   type: "error",
    //   text1: "API Error",
    //   text2: error.response?.data?.message || "Có lỗi xảy ra!",
    // });

    throw error;
  }
};

export const splitNameClass = (nameClass: string) => {
  if (!nameClass) return { key: "", label: "" };

  const parts = nameClass.split("-");
  return {
    key: parts[0]?.trim() || "",
    label: parts[1]?.trim() || "",
  };
};

// Hàm format ngày
export const formatDate = (dateString?: string) => {
  if (!dateString) return "Không có";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit", // ✅ thêm giây
    });
  } catch {
    return "Không hợp lệ";
  }
};

// Chuẩn hóa text để so sánh
export function normalizeValue(value?: any): string {
  if (value === null || value === undefined) return "";
  return String(value) // ✅ ép sang string để tránh lỗi .replace
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
