import React from "react";
import { View, StyleSheet } from "react-native";
import ListContainer from "@/app/(dataClass)/list";
import { useLocalSearchParams } from "expo-router";

export default function RelaterListScreen() {
  const params = useLocalSearchParams<{ name: string }>();
  const name = params.name;

  return (
    <View style={styles.container}>
      <ListContainer name={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
});
