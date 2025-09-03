import { Stack, useLocalSearchParams } from "expo-router";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import {
  defaultHeaderOptions,
  HeaderRightButton,
} from "@/components/HeaderOptions";

function TaiSanScreens() {
  const { title } = useHeader(); // bây giờ hook nằm bên trong provider
  const { titleHeader } = useLocalSearchParams<{ titleHeader?: string }>();

  return (
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
          title: title || "Thông tin", // title sẽ phản ứng theo context
        }}
      />
      <Stack.Screen
        name="related-list"
        options={{
          ...defaultHeaderOptions,
          title: title || "Chi tiết", // title sẽ phản ứng theo context
        }}
      />
    </Stack>
  );
}

export default function TaiSanLayout() {
  return (
    <HeaderProvider>
      <TaiSanScreens />
    </HeaderProvider>
  );
}
