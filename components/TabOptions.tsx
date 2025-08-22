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
};

type TabCustomProps = {
  screens?: ScreenOption[];
  showHeader?: boolean;
  backgroundColor?: string;
  customHeader?: React.ComponentType<any>;
};

export default function TabCustom({
  screens = [],
  showHeader = true,
  backgroundColor = "#fff",
  customHeader: HeaderComponent = CustomHeader,
}: TabCustomProps) {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: showHeader,
        header: () => <HeaderComponent />,
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
      {screens.map(
        (screen, index) => (
          console.log(`Registering tab: ${screen.name}`),
          (
            <Tabs.Screen
              key={index}
              name={screen.name}
              options={{
                title: screen.title || "",
                tabBarIcon: ({ color }) => (
                  <Ionicons name={screen.icon} size={24} color={color} />
                ),
              }}
            />
          )
        )
      )}
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
