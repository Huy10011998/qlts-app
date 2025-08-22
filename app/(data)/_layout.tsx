import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DataLayout() {
  const commonHeaderOptions = (title: string, navigation: any) => ({
    title,
    headerStyle: {
      backgroundColor: "#FF3333",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold" as "bold",
    },
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.canGoBack() && navigation.goBack()}
        style={{ paddingHorizontal: 5 }}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    ),
  });

  return (
    <Stack>
      <Stack.Screen
        name="maymoc/index"
        options={({ navigation }) => commonHeaderOptions("Máy móc", navigation)}
      />
      <Stack.Screen
        name="maytinh"
        options={({ navigation }) =>
          commonHeaderOptions("Máy tính", navigation)
        }
      />
    </Stack>
  );
}
