import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface CustomHeaderProps {
  visible?: boolean; // Prop để ẩn/hiện header
}

export default function CustomHeader({ visible = true }: CustomHeaderProps) {
  // Nếu visible = false thì không render header
  if (!visible) return null;

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
