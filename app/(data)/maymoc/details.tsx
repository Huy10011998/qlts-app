import { SafeAreaView, StyleSheet } from "react-native";
import { Details } from "@/app/(dataClass)/details";

export default function ChiTietScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Details />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
});
