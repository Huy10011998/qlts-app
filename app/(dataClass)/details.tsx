import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Field } from "@/services/data/callApi";
import { getFieldValue } from "@/utils/helper";

interface GroupListProps {
  groupedFields: Record<string, Field[]>;
  collapsedGroups: Record<string, boolean>;
  toggleGroup: (groupName: string) => void;
  getFieldValue: (item: any, field: Field) => string;
  item: any;
}

interface BottomBarProps {
  activeTab: string;
  onTabPress: (tabKey: string, label: string) => void;
}

interface DetailsProps {
  activeTab: string;
  groupedFields: Record<string, Field[]>;
  collapsedGroups: Record<string, boolean>;
  toggleGroup: (groupName: string) => void;
  item: any;
}

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

export const GroupList: React.FC<GroupListProps> = ({
  groupedFields,
  collapsedGroups,
  toggleGroup,
  getFieldValue,
  item,
}) => {
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
                  {getFieldValue(item, field)}
                </Text>
              ))}
          </View>
        );
      })}
    </>
  );
};

export const BottomBar: React.FC<BottomBarProps> = ({
  activeTab,
  onTabPress,
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

export const CenterText = ({ text }: { text: string }) => (
  <View style={styles.centerContent}>
    <Text>{text}</Text>
  </View>
);

export function Details({
  activeTab,
  groupedFields,
  collapsedGroups,
  toggleGroup,
  item,
  onTabPress,
}: DetailsProps & { onTabPress: (tabKey: string, label: string) => void }) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "list":
        return (
          <ScrollView contentContainerStyle={styles.scrollInner}>
            <GroupList
              groupedFields={groupedFields}
              collapsedGroups={collapsedGroups}
              toggleGroup={toggleGroup}
              getFieldValue={getFieldValue}
              item={item}
            />
          </ScrollView>
        );
      case "details":
        return <CenterText text="Chi tiết" />;
      case "notes":
        return <CenterText text="Note content" />;
      case "history":
        return <CenterText text="Lịch sử content" />;
      case "attach":
        return <CenterText text="Tệp content" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderTabContent()}
      <BottomBar activeTab={activeTab} onTabPress={onTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollInner: { padding: 16, paddingBottom: 80 },
  loader: { flex: 1, justifyContent: "center" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
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
