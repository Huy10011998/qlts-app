import React from "react";
import { View, StyleSheet } from "react-native";
import ListContainer from "@/app/(dataClass)/list";
import { useParams } from "@/hooks/useParams";

export default function RelaterListScreen() {
  const { name } = useParams();

  return (
    <View style={styles.container}>
      <ListContainer name={name} path={"related-details"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
});
