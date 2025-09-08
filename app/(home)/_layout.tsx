import { View } from "react-native";
import TabHome from "@/components/tabs/TabHome";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <TabHome
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
