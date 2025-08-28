import { BottomBar, Details } from "@/app/(dataClass)/details";
import IsLoading from "@/components/ui/IconLoading";
import { useHeader } from "@/context/HeaderContext";
import { Field } from "@/utils/helper";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

export default function ChiTietScreen() {
  const params = useLocalSearchParams();
  const { setTitle } = useHeader();
  const [activeTab, setActiveTab] = useState("list");
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

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

  const handleChangeTab = (tabKey: string, label: string) => {
    setActiveTab(tabKey);
    setTitle(label);
  };

  useEffect(() => {
    setTitle("Thông tin");
    setActiveTab("list");
  }, [setTitle]);

  if (!params.item) {
    return <IsLoading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <Details
        activeTab={activeTab}
        groupedFields={groupedFields}
        collapsedGroups={collapsedGroups}
        toggleGroup={toggleGroup}
        item={item}
        onTabPress={handleChangeTab}
      />
      <BottomBar activeTab={activeTab} onTabPress={handleChangeTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
