import React, { JSX } from "react";
import { ScrollView } from "react-native";
import { TabContentProps } from "@/types";
import GroupList from "./GroupList";
import CenterText from "./ThemedCenterText";
import DeTails from "@/app/(dataProperty)/details";

export default function TabContent({
  activeTab,
  groupedFields,
  collapsedGroups,
  toggleGroup,
  getFieldValue,
  item,
}: TabContentProps) {
  const tabContentMap: Record<string, JSX.Element> = {
    list: (
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 70 }}>
        <GroupList
          groupedFields={groupedFields}
          collapsedGroups={collapsedGroups}
          toggleGroup={toggleGroup}
          getFieldValue={getFieldValue}
          item={item}
        />
      </ScrollView>
    ),
    details: <DeTails />,
    notes: <CenterText text={item.notes || "---"} />,
    history: <CenterText text="Lịch sử content" />,
    attach: <CenterText text="Tệp content" />,
  };

  return tabContentMap[activeTab] || <CenterText text="Tab không hợp lệ" />;
}
