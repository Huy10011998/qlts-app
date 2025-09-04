import { Stack, useLocalSearchParams } from "expo-router";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import {
  defaultHeaderOptions,
  HeaderRightButton,
} from "@/components/HeaderOptions";
import { SearchProvider } from "@/context/SearchContext";

function TaiSanScreens() {
  const { title } = useHeader(); // bây giờ hook nằm bên trong provider
  const { titleHeader } = useLocalSearchParams<{ titleHeader?: string }>();

  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen
          name="list"
          options={{
            ...defaultHeaderOptions,
            title: titleHeader || "Tài sản",
            headerRight: () => <HeaderRightButton />,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            ...defaultHeaderOptions,
            title: title || "Chi tiết",
          }}
        />
        <Stack.Screen
          name="related-list"
          options={{
            ...defaultHeaderOptions,
            title: titleHeader || "Tài sản",
            headerRight: () => <HeaderRightButton />,
          }}
        />
        <Stack.Screen
          name="related-details"
          options={{
            ...defaultHeaderOptions,
            title: "Chi tiết",
          }}
        />
      </Stack>
    </SearchProvider>
  );
}

export default function TaiSanLayout() {
  return (
    <HeaderProvider>
      <TaiSanScreens />
    </HeaderProvider>
  );
}
