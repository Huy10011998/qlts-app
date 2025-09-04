// src/types/api.d.ts

import { Ionicons } from "@expo/vector-icons";
import { Item } from "./model.d";

export interface GetMenuActiveResponse {
  data: Item[];
  success?: boolean;
  message?: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

export interface PropertyResponse {
  iconMobile: string;
}

export interface MenuItemResponse {
  id: string;
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  propertyReference: string; // ✅ cho phép undefined
}
