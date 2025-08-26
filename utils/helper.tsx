import { Field } from "@/services/data/callApi";
import * as Crypto from "expo-crypto";
import { TypeProperty } from "./enum";

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
