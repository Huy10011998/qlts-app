import { Stack, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSearch } from "@/context/SearchContext";
import { NavigationProp } from "@react-navigation/native";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";

// Nút tìm kiếm bên phải
function HeaderRightButton() {
  const { toggleSearch } = useSearch();
  return (
    <TouchableOpacity onPress={toggleSearch} style={{ paddingHorizontal: 10 }}>
      <Ionicons name="search" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

// Nút quay lại bên trái
function HeaderBackButton() {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.canGoBack() && navigation.goBack()}
      style={{ paddingHorizontal: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

// Cấu hình mặc định cho header
const defaultHeaderOptions: React.ComponentProps<
  typeof Stack.Screen
>["options"] = {
  headerStyle: { backgroundColor: "#FF3333" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerLeft: () => <HeaderBackButton />,
};

export default function MayMocLayout() {
  return (
    <HeaderProvider>
      <StackScreens />
    </HeaderProvider>
  );
}

function StackScreens() {
  const { title } = useHeader(); // bây giờ hook nằm bên trong provider

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          ...defaultHeaderOptions,
          title: "Máy móc",
          headerRight: () => <HeaderRightButton />,
        }}
      />
      <Stack.Screen
        name="[id]/index"
        options={{
          ...defaultHeaderOptions,
          title: title || "Thông tin", // title sẽ phản ứng theo context
        }}
      />
    </Stack>
  );
}
