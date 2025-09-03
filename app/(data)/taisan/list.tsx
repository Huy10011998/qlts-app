import React from "react";
import { View, StyleSheet } from "react-native";
import { AddItemAsset } from "@/components/AddItemAsset";
import ListContainer from "@/app/(dataClass)/list";

export default function TaiSanScreen() {
  return (
    <View style={styles.container}>
      <ListContainer />
      <AddItemAsset />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
});
