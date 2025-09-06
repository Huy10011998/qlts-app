import { StyleSheet, View } from "react-native";
import Details from "@/app/(dataClass)/details";
import TabContent from "@/components/tabs/TabContent";
import BottomBarDetails from "@/components/bottom/BottomDetails";

export default function ChiTietScreen() {
  return (
    <View style={styles.container}>
      <Details>
        {({
          activeTab,
          setActiveTab,
          groupedFields,
          collapsedGroups,
          toggleGroup,
          item,
          getFieldValue,
          TAB_ITEMS,
        }) => (
          <>
            <TabContent
              activeTab={activeTab}
              groupedFields={groupedFields}
              collapsedGroups={collapsedGroups}
              toggleGroup={toggleGroup}
              getFieldValue={getFieldValue}
              item={item}
            />

            <BottomBarDetails
              activeTab={activeTab}
              onTabPress={setActiveTab}
              tabs={TAB_ITEMS ?? []}
            />
          </>
        )}
      </Details>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
