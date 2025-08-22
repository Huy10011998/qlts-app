import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");
const itemWidth = screenWidth / 3;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  notificationCount?: number;
  onPress?: () => void;
};
type MenuItemCardProps = MenuItem & { index: number };

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  icon,
  label,
  notificationCount,
  index,
  onPress,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      delay: index * 100,
    }).start();
  }, [index, scaleAnim]);

  return (
    <AnimatedTouchable
      style={[styles.menuItemContainer, { transform: [{ scale: scaleAnim }] }]}
      onPress={onPress}
    >
      <View style={styles.menuItemBox}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>{icon}</View>
          {notificationCount && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>{notificationCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuItemLabel}>{label}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const menuItems: MenuItem[] = [
    {
      onPress: () => router.push("/(menu)/taisan"),
      icon: <Ionicons name="server" size={24} color="white" />,
      label: "Tài sản",
    },
    {
      icon: <Ionicons name="person-add" size={24} color="white" />,
      label: "Công việc",
    },
    // {
    //   icon: <Ionicons name="desktop" size={24} color="white" />,
    //   label: "Văn phòng số",
    //   notificationCount: 21,
    // },
    // {
    //   icon: <Ionicons name="list" size={24} color="white" />,
    //   label: "Quy trình",
    // },
    // {
    //   icon: <Ionicons name="trending-up" size={24} color="white" />,
    //   label: "Kinh doanh",
    // },
    // {
    //   icon: <Ionicons name="book" size={24} color="white" />,
    //   label: "Kế toán",
    // },
    // {
    //   icon: <Ionicons name="cart" size={24} color="white" />,
    //   label: "Cung ứng SX",
    // },

    // {
    //   icon: <Ionicons name="people" size={24} color="white" />,
    //   label: "Nhân sự",
    // },
    {
      icon: <Ionicons name="pricetag" size={24} color="white" />,
      label: "Ticket",
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.gridWrapper}>
        {menuItems.map((item, index) => (
          <MenuItemCard key={index} {...item} index={index} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    backgroundColor: "white",
    flexGrow: 1,
  },
  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  menuItemContainer: {
    width: itemWidth,
    alignItems: "center",
    marginBottom: 16,
  },
  menuItemBox: {
    width: itemWidth - 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    position: "relative",
  },
  iconCircle: {
    backgroundColor: "#FF3333",
    padding: 16,
    borderRadius: 50,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 4,
    minWidth: 18,
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  menuItemLabel: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default HomeScreen;
