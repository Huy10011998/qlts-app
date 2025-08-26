import { Stack } from "expo-router";
import { SearchProvider } from "@/context/SearchContext";

export default function DataLayout() {
  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen name="maymoc/index" options={{ headerShown: false }} />
        <Stack.Screen name="maytinh" options={{ headerShown: false }} />
      </Stack>
    </SearchProvider>
  );
}
