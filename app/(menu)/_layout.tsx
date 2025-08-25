import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="taisan"
        options={({ navigation }) => ({
          title: "Tài sản",
          headerStyle: {
            backgroundColor: "#FF3333",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              style={{ paddingHorizontal: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log("Search icon pressed");
                // Thêm hành động mở modal hoặc điều hướng sang màn hình tìm kiếm tại đây
              }}
              style={{ paddingHorizontal: 10 }}
            >
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
}
