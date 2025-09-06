import React, { JSX } from "react";
import { ScrollView } from "react-native";
import { TabContentProps } from "@/types";
import GroupList from "../GroupList";
import CenterText from "../theme/ThemedCenterText";
import DeTailsTab from "../DetailsTab";
import ListHistory from "../list/ListHistory";

export default function TabContent({
  activeTab,
  groupedFields,
  collapsedGroups,
  toggleGroup,
  getFieldValue,
  item,
  previousItem,
  isFieldChanged,
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
          previousItem={previousItem}
          isFieldChanged={isFieldChanged}
        />
      </ScrollView>
    ),
    details: <DeTailsTab />,
    notes: <CenterText text={item?.notes ?? "---"} />,
    history: <ListHistory />,
    attach: <CenterText text="Tệp content" />,
  };

  return tabContentMap[activeTab] || <CenterText text="Tab không hợp lệ" />;
}
