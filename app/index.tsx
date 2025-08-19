import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../components/auth/AuthProvider";
import { ThemedText } from "../components/ThemedText";
import { ThemedTextInput } from "../components/ThemedTextInput";
import { ThemedView } from "../components/ThemedView";
import { md5Hash } from "../utils/hash";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function LoginScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useAuth();
  const hasTriedFaceID = useRef(false);

  useEffect(() => {
    setIsLoginDisabled(!(userName.trim() && userPassword.trim()));
  }, [userName, userPassword]);

  useFocusEffect(
    useCallback(() => {
      const tryAutoLoginWithFaceID = async () => {
        if (hasTriedFaceID.current) return; // Chạy duy nhất 1 lần
        hasTriedFaceID.current = true;

        const savedData = await SecureStore.getItemAsync("faceid_credentials");
        if (savedData) {
          const compatible = await LocalAuthentication.hasHardwareAsync();
          const enrolled = await LocalAuthentication.isEnrolledAsync();

          if (compatible && enrolled) {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: "Xác thực để đăng nhập",
              fallbackLabel: "Dùng mật khẩu",
            });

            if (result.success) {
              const { userName, userPassword } = JSON.parse(savedData);
              try {
                const response = await axios.post(
                  "http://192.168.10.210:8869/api/Authorization/login",
                  { userName, userPassword }
                );

                if (response.status === 200) {
                  setToken(response.data.data.accessToken);

                  router.replace("/(tabs)/home");
                }
              } catch (error) {
                console.error("Login error:", error);
                Alert.alert("Lỗi", "Không thể đăng nhập tự động.");
              }
            }
          }
        }
      };

      tryAutoLoginWithFaceID();
    }, [setToken, router])
  );

  const handlePressLogin = async () => {
    if (isLoading) return;
    Keyboard.dismiss();
    setIsLoading(true);

    const hashedPassword = await md5Hash(userPassword);

    try {
      const response = await axios.post(
        "http://192.168.10.210:8869/api/Authorization/login",
        { userName, userPassword: hashedPassword }
      );

      if (response.status === 200) {
        setToken(response.data.data.accessToken);

        Alert.alert(
          "Lưu đăng nhập?",
          "Bạn có muốn sử dụng Face ID để đăng nhập tự động lần sau?",
          [
            {
              text: "Không",
              style: "cancel",
              onPress: () => {
                router.replace("/(tabs)/home");
              },
            },
            {
              text: "Có",
              onPress: async () => {
                try {
                  await SecureStore.setItemAsync(
                    "faceid_credentials",
                    JSON.stringify({ userName, userPassword: hashedPassword })
                  );
                } catch (error) {
                  console.warn("Không thể lưu thông tin FaceID:", error);
                }

                router.replace("/(tabs)/home");
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu.");
      setUserPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceIDLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!compatible || !enrolled) {
        Alert.alert("Thiết bị không hỗ trợ hoặc chưa cài Face ID.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Đăng nhập bằng Face ID",
        fallbackLabel: "Dùng mật khẩu",
      });

      if (result.success) {
        const savedData = await SecureStore.getItemAsync("faceid_credentials");
        if (!savedData) {
          Alert.alert("Không tìm thấy thông tin đăng nhập đã lưu.");
          return;
        }

        const { userName, userPassword } = JSON.parse(savedData); // userPassword = MD5 rồi
        console.log("userPassword:", userPassword);
        try {
          const response = await axios.post(
            "http://192.168.10.210:8869/api/Authorization/login",
            { userName, userPassword }
          );
          if (response.status === 200) {
            setToken(response.data.data.accessToken);
            router.replace("/(tabs)/home");
          }
        } catch (error) {
          console.error("Login error:", error);
          Alert.alert(
            "Đăng nhập thất bại",
            "Không thể đăng nhập bằng Face ID."
          );
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xác thực Face ID.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ThemedView style={[styles.contaiContent, { flex: 0.5 }]}>
          <Image
            source={require("../assets/images/logo-cholimex.jpg")}
            style={styles.logoCholimex}
          />
        </ThemedView>

        <ThemedView style={[styles.contaiInput, { flex: 0.5 }]}>
          <ThemedTextInput
            placeholder="Tài khoản"
            value={userName}
            onChangeText={setUserName}
          />
          <ThemedView style={styles.contaiInputPW}>
            <ThemedTextInput
              secureTextEntry={!isPasswordVisible}
              placeholder="Mật khẩu"
              value={userPassword}
              onChangeText={setUserPassword}
            />
            <TouchableOpacity
              style={styles.iconEyeContainer}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Image
                source={
                  isPasswordVisible
                    ? require("../assets/images/iconEye-hide.png")
                    : require("../assets/images/iconEye-view.png")
                }
                style={styles.iconEye}
              />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.rowContainer}>
            <TouchableOpacity
              style={[styles.btnContai, isLoginDisabled && styles.disabledBtn]}
              onPress={handlePressLogin}
              disabled={isLoginDisabled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <ThemedText type="default">Đăng nhập</ThemedText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconFaceID}
              onPress={handleFaceIDLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Image
                  source={require("../assets/images/faceid-icon2.png")}
                  style={styles.faceIDIcon}
                />
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  bgLogin: {
    width: windowWidth,
    height: windowHeight,
  },
  contaiContent: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contaiInput: {
    width: "100%",
    padding: 16,
  },
  logoCholimex: {
    resizeMode: "contain",
    width: 300,
    height: 150,
  },
  contaiInputPW: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
  },
  iconEyeContainer: {
    position: "absolute",
    right: 10,
  },
  iconEye: {
    width: 25,
    height: 25,
  },
  btnContai: {
    borderRadius: 8,
    width: "80%",
    height: 60,
    padding: 20,
    backgroundColor: "#FF3333",
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.6,
    backgroundColor: "#cccccc",
  },
  iconFaceID: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  faceIDIcon: {
    width: 50,
    height: 50,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
});
