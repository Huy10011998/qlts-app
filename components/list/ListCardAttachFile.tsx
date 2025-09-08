import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardItemProps } from "@/types";

export default function ListCardAttachFile({ item, icon }: CardItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons
          name={
            (icon as keyof typeof Ionicons.glyphMap) || "document-text-outline"
          }
          size={24}
          color="#FF3333"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>{item.moTa}</Text>
        <Text style={styles.text}>{item.name || "Không có tên file"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  info: { flex: 1 },
  text: { fontSize: 14, color: "#444", marginTop: 4 },
  label: { fontWeight: "bold", color: "#000", fontSize: 14 },
});
