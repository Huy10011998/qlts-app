import { Ionicons } from "@expo/vector-icons";

export type ButtonItem = {
  id: number;
  name: string;
  route: string; // route chính
  root: string; // root path cho tab
  icon: keyof typeof Ionicons.glyphMap;
};
