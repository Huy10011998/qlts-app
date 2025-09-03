import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GroupListProps } from "@/types";

export default function GroupList({
  groupedFields,
  collapsedGroups,
  toggleGroup,
  getFieldValue,
  item,
}: GroupListProps) {
  return (
    <>
      {Object.entries(groupedFields).map(([groupName, fields]) => {
        const isCollapsed = collapsedGroups[groupName];
        return (
          <View key={groupName} style={styles.groupCard}>
            <TouchableOpacity
              style={styles.groupHeader}
              onPress={() => toggleGroup(groupName)}
              activeOpacity={0.7}
            >
              <Text style={styles.groupTitle}>{groupName}</Text>
              <Ionicons
                name={isCollapsed ? "chevron-down" : "chevron-up"}
                size={22}
                color="#222"
              />
            </TouchableOpacity>

            {!isCollapsed &&
              fields.map((field) => (
                <Text key={field.name} style={styles.text}>
                  <Text style={styles.label}>{field.moTa}: </Text>
                  {getFieldValue(item, field) || "---"}
                </Text>
              ))}
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 12,
  },
  groupTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
  text: { fontSize: 14, color: "#000", marginBottom: 6 },
  label: { fontWeight: "600", color: "#000" },
});
