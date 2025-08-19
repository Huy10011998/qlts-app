import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useAuth } from "../../components/auth/AuthProvider";
import LottieView from "lottie-react-native";

const user = {
  name: "Thái Minh Thanh Quốc Huy",
  avatar: null,
};

const ProfileHeader = ({ name }: { name: string }) => (
  <View style={styles.profileHeader}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>T</Text>
    </View>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const SettingItem = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.iconWrapper}>{icon}</View>
    <Text style={styles.label}>{label}</Text>
    <Ionicons
      name="chevron-forward"
      size={20}
      color="#999"
      style={styles.chevron}
    />
  </TouchableOpacity>
);

const VersionInfo = ({
  current,
  latest,
}: {
  current: string;
  latest: string;
}) => (
  <View style={styles.versionWrapper}>
    <Text style={styles.versionTitle}>Phiên bản</Text>
    <View style={styles.versionRow}>
      <Text>Phiên bản hiện tại</Text>
      <Text>{current}</Text>
    </View>
    <View style={styles.versionRow}>
      <Text>Phiên bản mới nhất</Text>
      <Text style={styles.versionNew}>{latest}</Text>
    </View>
  </View>
);

const SettingScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  const handlePressLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await Promise.all([
        SecureStore.deleteItemAsync("faceid_credentials"),
        AsyncStorage.removeItem("token"),
      ]);

      setToken(null); // sẽ trigger re-render

      router.replace("/"); // reset về login
    } catch (error) {
      if (__DEV__) {
        console.error("Logout error:", error);
      }
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const settings = [
    {
      icon: <Ionicons name="person-circle-outline" size={22} color="#fff" />,
      label: "Hồ sơ/Profile",
      onPress: () => {},
    },
    {
      icon: <Ionicons name="lock-closed-outline" size={22} color="#fff" />,
      label: "Đổi mật khẩu/Change Password",
      onPress: () => {},
    },
    {
      icon: <Ionicons name="language-outline" size={22} color="#fff" />,
      label: "Ngôn ngữ/Language",
      onPress: () => {},
    },
    {
      icon: <Ionicons name="phone-portrait-outline" size={22} color="#fff" />,
      label: "Thiết bị/Device",
      onPress: () => {},
    },
    {
      icon: <Ionicons name="log-out-outline" size={22} color="#fff" />,
      label: "Đăng xuất / Log out",
      onPress: () => {
        Alert.alert(
          "Xác nhận đăng xuất",
          "Bạn có chắc chắn muốn đăng xuất?",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Đăng xuất",
              style: "destructive",
              onPress: handlePressLogout,
            },
          ],
          { cancelable: true }
        );
      },
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <ProfileHeader name={user.name} />
        <View style={styles.section}>
          {settings.map((item, index) => (
            <SettingItem key={index} {...item} />
          ))}
        </View>
        <VersionInfo current="8.9.3" latest="8.9.3" />
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <LottieView
              source={require("../../assets/animations/loading.json")}
              autoPlay
              loop
              style={{ width: 30, height: 30 }}
            />
            <Text style={styles.loadingText}>Đang đăng xuất...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D4B73",
  },
  section: {
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF3333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: "#2D4B73",
  },
  chevron: {
    marginLeft: 6,
  },
  versionWrapper: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  versionTitle: {
    fontWeight: "bold",
    color: "#888",
    marginBottom: 8,
  },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  versionNew: {
    color: "#1E90FF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
});

export default SettingScreen;
