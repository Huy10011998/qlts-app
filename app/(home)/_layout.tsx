import { View } from "react-native";
import HomeScreen from "./trangchu";
import HeaderOptions from "@/components/HeaderOptions";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <HeaderOptions />
      <HomeScreen />
    </View>
  );
}
