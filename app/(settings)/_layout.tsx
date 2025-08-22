import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsLayout() {
  const commonHeaderOptions = (
    title: string,
    navigation: any,
    showBack: boolean = false
  ) => ({
    title,
    headerStyle: {
      backgroundColor: "#FF3333",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold" as "bold",
    },
    // Chỉ hiển thị nút back nếu showBack = true
    headerLeft: showBack
      ? () => (
          <TouchableOpacity
            onPress={() => navigation.canGoBack() && navigation.goBack()}
            style={{ paddingHorizontal: 5 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )
      : undefined,
  });

  return (
    <Stack>
      {/* Màn hình "thongtin" không có nút back */}
      <Stack.Screen
        name="thongtin"
        options={({ navigation }) =>
          commonHeaderOptions("Cài đặt", navigation, false)
        }
      />

      {/* Màn hình "hoso" có nút back */}
      <Stack.Screen
        name="hoso"
        options={({ navigation }) =>
          commonHeaderOptions("Hồ sơ cá nhân", navigation, true)
        }
      />
    </Stack>
  );
}
