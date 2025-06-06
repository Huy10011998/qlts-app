import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={({ navigation }) => ({
          title: "Setting",
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
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      {/* <Stack.Screen name="profile" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
