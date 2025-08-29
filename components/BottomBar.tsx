import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, usePathname, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type ButtonItem = {
  id: number;
  name: string;
  route: string; // route chính
  root: string; // root path cho tab
  icon: keyof typeof Ionicons.glyphMap;
};

const buttons: ButtonItem[] = [
  {
    id: 1,
    name: "Trang chủ",
    route: "/trangchu",
    root: "/(home)/trangchu",
    icon: "home",
  },
  {
    id: 3,
    name: "Cài đặt",
    route: "/thongtin",
    root: "/(settings)/thongtin",
    icon: "settings",
  },
];

const ACTIVE = "#e74c3c";
const INACTIVE = "#888";

function BottomBarButton({
  btn,
  isActive,
  onPress,
}: {
  btn: ButtonItem;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(isActive ? 1.1 : 1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isActive ? 1.1 : 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [isActive, scale]);

  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Animated.View style={[styles.innerButton, { transform: [{ scale }] }]}>
        <Ionicons
          name={btn.icon}
          size={26}
          color={isActive ? ACTIVE : INACTIVE}
        />
        <Text style={[styles.label, { color: isActive ? ACTIVE : INACTIVE }]}>
          {btn.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [activeId, setActiveId] = useState<number>(1);
  const [lastActiveId, setLastActiveId] = useState<number>(1);

  // Cập nhật activeId theo URL
  useEffect(() => {
    const matched = buttons.find((btn) => pathname.startsWith(btn.route));
    if (matched) {
      setActiveId(matched.id);
      setLastActiveId(matched.id);
    } else {
      setActiveId(lastActiveId);
    }
  }, [pathname, lastActiveId]);

  return (
    <View style={styles.container}>
      {buttons.map((btn) => {
        const isActive = activeId === btn.id;
        return (
          <BottomBarButton
            key={btn.id}
            btn={btn}
            isActive={isActive}
            onPress={() => {
              // Nếu đã ở màn hình chính thì không điều hướng lại
              if (pathname === btn.route) return;

              // Nếu đang ở màn hình con của tab này → quay về route chính
              if (pathname.startsWith(btn.route)) {
                router.replace(btn.route as Href);
                return;
              }

              // Nếu đang ở tab khác → chuyển sang tab mới
              setActiveId(btn.id);
              setLastActiveId(btn.id);
              router.replace(btn.route as Href);
            }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    paddingBottom: 15,
    elevation: 5,
  },
  button: { flex: 1, justifyContent: "center", alignItems: "center" },
  innerButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
});
