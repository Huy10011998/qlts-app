import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Định nghĩa kiểu cho AuthContext
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  // Hàm cập nhật token: lưu AsyncStorage + cập nhật state
  const updateToken = async (newToken: string | null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem("token", newToken);
      } else {
        await AsyncStorage.removeItem("token");
      }
      setToken(newToken);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  // Tải token từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");

        if (savedToken) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Failed to load auth from storage:", error);
      }
    };

    loadStoredAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken: updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
