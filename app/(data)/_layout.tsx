import { Stack } from "expo-router";

export default function DataLayout() {
  return (
    <Stack>
      <Stack.Screen name="taisan" options={{ headerShown: false }} />
    </Stack>
  );
}
