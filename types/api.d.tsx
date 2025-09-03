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

export interface PropertyClass {
  iconMobile: string;
}

export interface MenuItemString {
  name: string | number | (string | number)[] | null | undefined;
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap; // Dùng cho icon dạng chuỗi
}

export interface MenuItemComponent {
  id: string;
  label: string;
  icon?: React.ReactNode; // Dùng cho icon là component React
  onPress?: () => void;
  notificationCount?: number;
}
