import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getFieldValue } from "@/utils/helper";
import { useHeader } from "@/context/HeaderContext";
import IsLoading from "@/components/ui/IconLoading";
import { DetailsProps, Field } from "@/types";
import { getDetails } from "@/services/data/callApi";

export const TAB_ITEMS = [
  { key: "list", label: "Thông tin", icon: "document-text-outline" },
  { key: "details", label: "Chi tiết", icon: "menu-outline" },
  { key: "notes", label: "Note", icon: "document-attach-outline" },
  { key: "history", label: "Lịch sử", icon: "time-outline" },
  { key: "attach", label: "Tệp", icon: "attach-outline" },
] as const;

// Xuất type TabItem từ TAB_ITEMS
export type TabItem = (typeof TAB_ITEMS)[number];

export default function Details({ children }: DetailsProps) {
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
      {children({
        activeTab,
        setActiveTab: handleChangeTab,
        groupedFields,
        collapsedGroups,
        toggleGroup,
        item,
        getFieldValue,
        TAB_ITEMS,
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
