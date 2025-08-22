import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type ButtonItem = {
  id: number;
  name: string;
  route: string;
  root: string;
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

type BottomBarProps = {
  visible?: boolean;
};

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
          color={isActive ? "#e74c3c" : "#888"}
        />
        <Text style={[styles.label, { color: isActive ? "#e74c3c" : "#888" }]}>
          {btn.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function BottomBar({ visible = true }: BottomBarProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<number>(1);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {buttons.map((btn) => {
        const isActive = btn.id === activeId;

        return (
          <BottomBarButton
            key={btn.id}
            btn={btn}
            isActive={isActive}
            onPress={() => {
              if (!isActive) {
                setActiveId(btn.id);
                router.replace(btn.route as Href);
              }
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
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
