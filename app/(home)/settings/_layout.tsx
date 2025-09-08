import { Stack } from "expo-router";
import { HeaderDetails } from "@/components/header/HeaderDetails";
import { SearchProvider } from "@/context/SearchContext";

export default function SettingsLayout() {
  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen
          name="thongtin"
          options={{
            ...HeaderDetails({ showBackButton: false }),
            title: "Cài đặt",
          }}
        />

        <Stack.Screen
          name="hoso"
          options={{
            ...HeaderDetails({ showBackButton: true }),
            title: "Hồ sơ cá nhân",
          }}
        />
      </Stack>
    </SearchProvider>
  );
}
