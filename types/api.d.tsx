// src/types/api.d.ts

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

export type MenuItem = {
  icon: React.ReactNode;
  label: string;
  notificationCount?: number;
  onPress?: () => void;
};
