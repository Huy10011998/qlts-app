import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useAuth } from "../../components/auth/AuthProvider";
import { API_ENDPOINTS } from "@/config";
import api from "@/services/api";
import { changePasswordApi } from "@/services/authApi";

interface UserInfo {
  userName?: string;
  moTa?: string;
  avatarUrl?: string;
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatarUrl }) => (
  <View style={styles.profileHeader}>
    <View style={styles.avatar}>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
      ) : (
        <Image
          source={require("../../assets/images/user.jpeg")}
          style={styles.avatarImage}
        />
      )}
    </View>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onPress }) => (
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

const InfoScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const [user, setUser] = useState<UserInfo | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();

  /** Lấy thông tin user */
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await api.post(API_ENDPOINTS.GET_INFO, {});
        const userData: UserInfo = response?.data?.data;
        setUser(userData);
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  /** Đăng xuất */
  const handlePressLogout = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("faceid_credentials"),
        AsyncStorage.removeItem("token"),
      ]);
      setToken(null);
      router.replace("/");
    } catch (error) {
      if (__DEV__) console.error("Logout error:", error);
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Đổi mật khẩu */
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await changePasswordApi(oldPassword, newPassword);

      if (response?.success) {
        Alert.alert("Thành công", "Đổi mật khẩu thành công!");
        setIsModalVisible(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Lỗi", response?.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error: any) {
      if (__DEV__) console.error("Change password error:", error);

      const message =
        error.response?.data?.message ||
        "Không thể đổi mật khẩu. Vui lòng thử lại.";
      Alert.alert("Lỗi", message);
    } finally {
      setIsLoading(false);
    }
  };

  /** Danh sách setting */
  const settings = [
    {
      icon: <Ionicons name="person-circle-outline" size={22} color="#fff" />,
      label: "Hồ sơ/Profile",
      onPress: () => router.push("/(settings)/hoso"),
    },
    {
      icon: <Ionicons name="lock-closed-outline" size={22} color="#fff" />,
      label: "Đổi mật khẩu/Change Password",
      onPress: () => setIsModalVisible(true),
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
        <ProfileHeader name={user?.moTa ?? "---"} avatarUrl={user?.avatarUrl} />
        <View style={styles.section}>
          {settings.map((item, index) => (
            <SettingItem key={index} {...item} />
          ))}
        </View>
      </ScrollView>

      {/* Loading overlay */}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#FF3333"
          style={{ justifyContent: "center", flex: 1 }}
        />
      )}

      {/* Modal đổi mật khẩu */}
      <Modal
        transparent
        animationType="fade"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  profileHeader: {
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 12,
  },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  name: { marginTop: 8, fontSize: 16, fontWeight: "bold" },
  section: { paddingHorizontal: 16 },
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
  label: { flex: 1, fontSize: 13, fontWeight: "bold" },
  chevron: { marginLeft: 6 },
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: "#ccc" },
  confirmButton: { backgroundColor: "#007BFF" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default InfoScreen;
