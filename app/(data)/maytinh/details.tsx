import { StyleSheet, View } from "react-native";
import { Details } from "@/app/(dataClass)/details";

export default function ChiTietScreen() {
  return (
    <View style={styles.container}>
      <Details />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
