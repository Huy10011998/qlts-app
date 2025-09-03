import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFieldValue } from "@/utils/helper";
import { useLocalSearchParams } from "expo-router";
import { useHeader } from "@/context/HeaderContext";
import IsLoading from "@/components/ui/IconLoading";
import { Field } from "@/types";
import { getDetails } from "@/services/data/callApi";
import TabContent from "@/components/TabContent";

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

export default function Details() {
  const params = useLocalSearchParams();
  const { setTitle } = useHeader();

  const [activeTab, setActiveTab] = useState("list");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState<any>(null);

  const nameClass = params.nameClass as string;

  const fieldActive: Field[] = useMemo(() => {
    try {
      return params.field ? JSON.parse(params.field as string) : [];
    } catch {
      return [];
    }
  }, [params.field]);

  const groupedFields = useMemo(() => {
    return fieldActive.reduce<Record<string, Field[]>>((groups, field) => {
      const groupName = field.groupLayout || "Thông tin chung";
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(field);
      return groups;
    }, {});
  }, [fieldActive]);

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleChangeTab = (tabKey: string, label: string) => {
    setActiveTab(tabKey);
    setTitle(label);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const id = Number(params.id);
        if (!id || !nameClass) throw new Error("Thiếu ID hoặc nameClass");

        const response = await getDetails(nameClass, id);

        setItem(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", `Không thể tải chi tiết ${nameClass}`);
      } finally {
        setIsLoading(false);
      }
    };

    setTitle("Thông tin");
    setActiveTab("list");
    fetchDetails();
  }, [params.id, nameClass, setTitle]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <IsLoading />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <TabContent
        activeTab={activeTab}
        groupedFields={groupedFields}
        collapsedGroups={collapsedGroups}
        toggleGroup={toggleGroup}
        getFieldValue={getFieldValue}
        item={item}
      />
      <BottomBar activeTab={activeTab} onTabPress={handleChangeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  centerContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3333",
    paddingVertical: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    paddingBottom: 30,
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
    bottom: 10,
    marginBottom: 15,
    height: 2,
    backgroundColor: "#fff",
    borderRadius: 1,
  },
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
