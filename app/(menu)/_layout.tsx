import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SearchProvider, useSearch } from "@/context/SearchContext";

function HeaderRightButton() {
  const { toggleSearch } = useSearch();
  return (
    <TouchableOpacity onPress={toggleSearch} style={{ paddingHorizontal: 10 }}>
      <Ionicons name="search" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

export default function MenuLayout() {
  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen
          name="taisan"
          options={({ navigation }) => ({
            title: "Tài sản",
            headerStyle: { backgroundColor: "#FF3333" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontWeight: "bold" },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.canGoBack() && navigation.goBack()}
                style={{ paddingHorizontal: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            ),
            headerRight: () => <HeaderRightButton />,
          })}
        />
      </Stack>
    </SearchProvider>
  );
}
