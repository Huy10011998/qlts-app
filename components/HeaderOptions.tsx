import React from "react";
import { Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSearch } from "@/context/SearchContext";
import { NavigationProp } from "@react-navigation/native";
import { Stack, useNavigation } from "expo-router";

export default function CustomHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/images/logo-cholimex.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <View style={styles.headerIcons}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons
            name="home-outline"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/(home)/trangchu")}>
          <Ionicons name="qr-code" size={24} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

// Nút tìm kiếm bên phải
export function HeaderRightButton() {
  const { toggleSearch } = useSearch();
  return (
    <TouchableOpacity onPress={toggleSearch} style={{ paddingHorizontal: 10 }}>
      <Ionicons name="search" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

// Nút quay lại bên trái
export function HeaderBackButton() {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.canGoBack() && navigation.goBack()}
      style={{ paddingHorizontal: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
// Cấu hình mặc định cho header
export const defaultHeaderOptions: React.ComponentProps<
  typeof Stack.Screen
>["options"] = {
  headerStyle: { backgroundColor: "#FF3333" },
  headerTintColor: "#fff",
  headerTitleStyle: { fontWeight: "bold" },
  headerLeft: () => <HeaderBackButton />,
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FF3333",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 16,
  },
});
