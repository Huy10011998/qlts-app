import { View } from "react-native";
import TabCustom from "@/components/TabOptions";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TabCustom
        screens={[
          {
            name: "trangchu",
            title: "Trang chủ",
            icon: "home",
            showHeader: true,
          },
          {
            name: "settings",
            title: "Cài đặt",
            icon: "settings",
            showHeader: false,
          },
        ]}
      />
    </View>
  );
}
