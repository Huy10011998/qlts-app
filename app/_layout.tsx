import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme, View, StyleSheet } from "react-native";
import "react-native-reanimated";
import { AuthProvider } from "../components/auth/AuthProvider";
import BottomBar from "../components/BottomBar";
import HeaderOptions from "@/components/HeaderOptions";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppNavigator colorScheme={colorScheme ?? "light"} />
    </AuthProvider>
  );
}

function AppNavigator({ colorScheme }: { colorScheme: "light" | "dark" }) {
  const pathname = usePathname();

  // Danh sách route không hiển thị BottomBar và Header
  const hiddenRoutes = ["/", "/login", "/splash"];
  const hiddenRoutesHeader = ["/trangchu"];

  const showBottomBar = !hiddenRoutes.includes(pathname ?? "");
  const showHeaderBar = hiddenRoutesHeader.includes(pathname ?? "");

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <HeaderOptions visible={showHeaderBar} />
        <View style={styles.content}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="(settings)" options={{ headerShown: false }} />
            <Stack.Screen name="(menu)" options={{ headerShown: false }} />
            <Stack.Screen name="(data)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </View>
        <BottomBar visible={showBottomBar} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
