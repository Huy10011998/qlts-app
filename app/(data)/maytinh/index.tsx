import React from "react";
import { View, StyleSheet } from "react-native";
import { ListContainer } from "@/app/(dataClass)/list";
import { AddItemAsset } from "@/components/AddItemAsset";

export default function MayTinhScreen() {
  const nameClass = "MayTinh";
  const pageSize = 20;

  return (
    <View style={styles.container}>
      <ListContainer nameClass={nameClass} pageSize={pageSize} />
      <AddItemAsset />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
});
