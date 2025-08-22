import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFieldActive, getList } from "@/services/data/callApi";

interface MayTinh {
  ten: string;
  ma: string;
  iD_LoaiMayTinh_MoTa: string;
  iD_NhaCungCap_MoTa: string;
}

export default function MayTinhList() {
  const [maytinh, setMayTinh] = useState<MayTinh[]>([]);
  const [fieldsActive, setFieldsActive] = useState<MayTinh[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const nameClass = "MayTinh";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getFieldActive(nameClass);
        if (response) {
          console.log("===", response);
          setFieldsActive(response);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
        setFieldsActive([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getList(nameClass, "", 20, 0, [], []);
        if (response?.data?.items) {
          setMayTinh(response.data.items);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
        setMayTinh([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem: ListRenderItem<MayTinh> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="laptop-outline" size={24} color="#0077CC" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{`${item.ma} - ${item.ten}`}</Text>

        <Text style={styles.text}>
          <Text style={styles.label}>Mã: </Text>
          {item.ma}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tên: </Text>
          <Ionicons
            name="checkmark-circle"
            size={14}
            color="green"
            style={styles.icon}
          />
          <Text style={styles.text}>{item.ten}</Text>
        </View>

        <Text style={styles.text}>
          <Text style={styles.label}>Loại: </Text>
          {item.iD_LoaiMayTinh_MoTa}
        </Text>

        <Text style={styles.text}>
          <Text style={styles.label}>NCC: </Text>
          {item.iD_NhaCungCap_MoTa}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF3333"
          style={{ justifyContent: "center", flex: 1 }}
        />
      ) : (
        <FlatList
          data={maytinh}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => console.log("FAB pressed")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  icon: {
    marginHorizontal: 2,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#FF3333",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
});
