import React from "react";
import { Platform, View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomHeader from "@/components/HeaderOptions";

type ScreenOption = {
  name: string;
  title?: string;
  icon: keyof typeof Ionicons.glyphMap;
  showHeader?: boolean; // <-- Thêm thuộc tính này
};

type TabCustomProps = {
  screens?: ScreenOption[];
  showHeader?: boolean; // default cho tất cả tabs nếu tab không khai báo riêng
  backgroundColor?: string;
  customHeader?: React.ComponentType<any>;
};

export default function TabCustom({
  screens = [],
  showHeader = true, // default value nếu tab không định nghĩa riêng
  backgroundColor = "#fff",
  customHeader: HeaderComponent = CustomHeader,
}: TabCustomProps) {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View
            style={[
              styles.tabBarBackground,
              { backgroundColor: backgroundColor },
            ]}
          />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            height: 70,
            backgroundColor: backgroundColor,
          },
          android: {
            position: "absolute",
            height: 70,
            backgroundColor: backgroundColor,
          },
        }),
      }}
    >
      {screens.map((screen, index) => {
        return (
          <Tabs.Screen
            key={index}
            name={screen.name}
            options={{
              title: screen.title || "",
              headerShown:
                screen.showHeader !== undefined
                  ? screen.showHeader
                  : showHeader, // ưu tiên giá trị riêng, fallback về default
              header: () => <HeaderComponent />,
              tabBarIcon: ({ color }) => (
                <Ionicons name={screen.icon} size={24} color={color} />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
});
