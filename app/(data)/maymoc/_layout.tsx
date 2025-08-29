import { Stack } from "expo-router";
import { HeaderProvider, useHeader } from "@/context/HeaderContext";
import {
  defaultHeaderOptions,
  HeaderRightButton,
} from "@/components/HeaderOptions";

function MayMocScreens() {
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
        name="details"
        options={{
          ...defaultHeaderOptions,
          title: title || "Thông tin", // title sẽ phản ứng theo context
        }}
      />
    </Stack>
  );
}

export default function MayMocLayout() {
  return (
    <HeaderProvider>
      <MayMocScreens />
    </HeaderProvider>
  );
}
