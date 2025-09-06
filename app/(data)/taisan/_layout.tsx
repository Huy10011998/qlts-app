import { Stack, useLocalSearchParams } from "expo-router";
import { defaultHeaderOptions } from "@/components/header/HeaderOptions";

export default function TaiSanScreens() {
  const { titleHeader } = useLocalSearchParams<{ titleHeader?: string }>();

  return (
    <Stack>
      <Stack.Screen
        name="list"
        options={{
          ...defaultHeaderOptions,
          title: titleHeader || "Tài sản",
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          ...defaultHeaderOptions,
          title: "Chi tiết",
        }}
      />
      <Stack.Screen
        name="related-list"
        options={{
          ...defaultHeaderOptions,
          title: titleHeader || "Tài sản",
        }}
      />
      <Stack.Screen
        name="related-details"
        options={{
          ...defaultHeaderOptions,
          title: "Chi tiết",
        }}
      />
      <Stack.Screen
        name="related-details-history"
        options={{
          ...defaultHeaderOptions,
          title: "Chi tiết",
        }}
      />
    </Stack>
  );
}
