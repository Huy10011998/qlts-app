import React from "react";
import { View, StyleSheet } from "react-native";
import BottomBar from "@/components/BottomBar";

export function ScreenWithBottomBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 }, // phần này sẽ là nội dung màn hình stack
});
