import { Stack } from "expo-router";
import { SearchProvider } from "@/context/SearchContext";

export default function DataLayout() {
  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen name="taisan" options={{ headerShown: false }} />
      </Stack>
    </SearchProvider>
  );
}
