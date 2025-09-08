import { HeaderDetails } from "@/components/header/HeaderDetails";
import { SearchProvider } from "@/context/SearchContext";
import { Stack, useLocalSearchParams } from "expo-router";

export default function TaiSanScreens() {
  const { titleHeader } = useLocalSearchParams<{ titleHeader?: string }>();

  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen
          name="list"
          options={{
            ...HeaderDetails({ showBackButton: true, showSearchButton: true }),
            title: titleHeader || "Tài sản",
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            ...HeaderDetails({ showBackButton: true }),

            title: "Chi tiết",
          }}
        />
        <Stack.Screen
          name="related-list"
          options={{
            ...HeaderDetails({ showBackButton: true, showSearchButton: true }),
            title: titleHeader || "Tài sản",
          }}
        />
        <Stack.Screen
          name="related-details"
          options={{
            ...HeaderDetails({ showBackButton: true }),
            title: "Chi tiết",
          }}
        />
        <Stack.Screen
          name="related-details-history"
          options={{
            ...HeaderDetails({ showBackButton: true }),
            title: "Chi tiết",
          }}
        />
      </Stack>
    </SearchProvider>
  );
}
