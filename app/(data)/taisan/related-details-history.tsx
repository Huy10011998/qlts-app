import { StyleSheet, View } from "react-native";
import TabContent from "@/components/tabs/TabDetails";
import DetailsHistory from "@/app/(dataClass)/details-history";

export default function RelatedDeTailsHistoryScreen() {
  return (
    <View style={styles.container}>
      <DetailsHistory>
        {({
          activeTab,
          groupedFields,
          collapsedGroups,
          toggleGroup,
          item,
          previousItem,
          getFieldValue,
          isFieldChanged,
        }) => (
          <TabContent
            activeTab={activeTab}
            groupedFields={groupedFields}
            collapsedGroups={collapsedGroups}
            toggleGroup={toggleGroup}
            getFieldValue={getFieldValue}
            item={item}
            previousItem={previousItem}
            isFieldChanged={isFieldChanged}
          />
        )}
      </DetailsHistory>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
