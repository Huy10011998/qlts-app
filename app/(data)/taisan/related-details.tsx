import { StyleSheet, View } from "react-native";
import Details from "@/app/(dataClass)/details";
import TabContent from "@/components/tabs/TabContent";

export default function RelatedDeTailsScreen() {
  return (
    <View style={styles.container}>
      <Details>
        {({
          activeTab,
          groupedFields,
          collapsedGroups,
          toggleGroup,
          item,
          getFieldValue,
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
          </>
        )}
      </Details>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
