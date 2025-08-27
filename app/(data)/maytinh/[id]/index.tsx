import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getFieldValue } from "@/utils/helper";
import { useHeader } from "@/context/HeaderContext";
import { Field } from "@/services/data/callApi";

const TAB_ITEMS = [
  { key: "list", label: "Thông tin", icon: "document-text-outline" },
  { key: "details", label: "Chi tiết", icon: "menu-outline" },
  { key: "notes", label: "Note", icon: "document-attach-outline" },
  { key: "history", label: "Lịch sử", icon: "time-outline" },
  { key: "attach", label: "Tệp", icon: "attach-outline" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / TAB_ITEMS.length;
const UNDERLINE_WIDTH = TAB_WIDTH * 0.6;

export default function ChiTietScreen() {
  const params = useLocalSearchParams();
  const { setTitle } = useHeader();

  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [activeTab, setActiveTab] = useState(TAB_ITEMS[0].key);

  const handleChangeTab = (tabKey: string, label: string) => {
    setActiveTab(tabKey);
    setTitle(label);
  };

  useEffect(() => {
    setTitle(TAB_ITEMS[0].label);
    setActiveTab(TAB_ITEMS[0].key);
  }, [setTitle]);

  const fieldActive: Field[] = useMemo(() => {
    try {
      return params.field ? JSON.parse(params.field as string) : [];
    } catch {
      return [];
    }
  }, [params.field]);

  const item = useMemo(() => {
    try {
      return params.item ? JSON.parse(params.item as string)?.data : null;
    } catch {
      return null;
    }
  }, [params.item]);

  const groupedFields = useMemo(() => {
    const groups: Record<string, Field[]> = {};
    fieldActive.forEach((field) => {
      const groupName = field.groupLayout || "Thông tin chung";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(field);
    });
    return groups;
  }, [fieldActive]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  if (!params.item) {
    return (
      <ActivityIndicator size="large" color="#FF3333" style={styles.loader} />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "list":
        return (
          <ScrollView contentContainerStyle={styles.scrollInner}>
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
                    fields.map((field) => {
                      return (
                        <Text key={field.name} style={styles.text}>
                          <Text style={styles.label}>{field.moTa}: </Text>
                          {getFieldValue(item, field)}
                        </Text>
                      );
                    })}
                </View>
              );
            })}
          </ScrollView>
        );
      case "details":
        return (
          <View style={styles.centerContent}>
            <Text>Chi tiết</Text>
          </View>
        );
      case "notes":
        return (
          <View style={styles.centerContent}>
            <Text>Note content</Text>
          </View>
        );
      case "history":
        return (
          <View style={styles.centerContent}>
            <Text>Lịch sử content</Text>
          </View>
        );
      case "attach":
        return (
          <View style={styles.centerContent}>
            <Text>Tệp content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderTabContent()}
      <BottomBar activeTab={activeTab} onTabPress={handleChangeTab} />
    </SafeAreaView>
  );
}

/** Bottom navigation bar */
const BottomBar = ({
  activeTab,
  onTabPress,
}: {
  activeTab: string;
  onTabPress: (tabKey: string, label: string) => void;
}) => {
  const startX = (TAB_WIDTH - UNDERLINE_WIDTH) / 2;
  const underlineX = useRef(new Animated.Value(startX)).current;

  const moveUnderlineTo = (index: number) =>
    index * TAB_WIDTH + (TAB_WIDTH - UNDERLINE_WIDTH) / 2;

  const handlePress = (tabKey: string, label: string) => {
    onTabPress(tabKey, label);
    const index = TAB_ITEMS.findIndex((t) => t.key === tabKey);
    Animated.spring(underlineX, {
      toValue: moveUnderlineTo(index),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.bottomBar}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.underline,
          { width: UNDERLINE_WIDTH, transform: [{ translateX: underlineX }] },
        ]}
      />
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.bottomItem, { width: TAB_WIDTH }]}
            onPress={() => handlePress(tab.key, tab.label)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color="#fff"
            />
            <Text
              style={[styles.bottomLabel, isActive && styles.bottomLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollInner: { padding: 16, paddingBottom: 80 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },

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

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3333",
    paddingVertical: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  bottomItem: { alignItems: "center", justifyContent: "center" },
  bottomLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.9,
  },
  bottomLabelActive: { opacity: 1, fontWeight: "800" },
  underline: {
    position: "absolute",
    bottom: 6,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
  loader: { flex: 1, justifyContent: "center" },
});
