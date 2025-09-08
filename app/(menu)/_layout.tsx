import { Stack } from "expo-router";
import { SearchProvider } from "@/context/SearchContext";
import React from "react";
import { HeaderDetails } from "@/components/header/HeaderDetails";

export default function MenuLayout() {
  return (
    <SearchProvider>
      <Stack>
        <Stack.Screen
          name="taisan"
          options={() => ({
            title: "Tài sản",
            ...HeaderDetails({ showBackButton: true, showSearchButton: true }),
          })}
        />
      </Stack>
    </SearchProvider>
  );
}
