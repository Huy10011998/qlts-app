import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getFieldActive,
  getList,
  getPropertyClass,
} from "@/services/data/callApi";

interface PropertyClass {
  iconMobile: string;
}

interface Field {
  name: string;
  moTa: string; // label
  isShowMobile: boolean;
}

export default function MayTinhList() {
  const [maytinh, setMayTinh] = useState<Record<string, any>[]>([]);
  const [fieldActive, setFieldActive] = useState<Field[]>([]);
  const [propertyClass, setpropertyClass] = useState<PropertyClass>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skipSize, setSkipSize] = useState(0);
  const [total, setTotal] = useState(0);

  const nameClass = "MayTinh";
  const pageSize = 20;

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const responseFieldActive = await getFieldActive(nameClass);
        const fieldActiveData =
          responseFieldActive?.data?.filter((f: any) => f.isShowMobile) || [];
        setFieldActive(fieldActiveData);

        const responsePropetyClass = await getPropertyClass(nameClass);
        const propertyClassData = responsePropetyClass?.data;
        setpropertyClass(propertyClassData);

        const currentSkip = isLoadMore ? skipSize : 0;
        const response = await getList(
          nameClass,
          "",
          pageSize,
          currentSkip,
          [],
          []
        );

        const newItems = response?.data?.items || [];
        const totalItems = response?.data?.totalCount || 0;

        if (isLoadMore) {
          setMayTinh((prev) => [...prev, ...newItems]);
          setSkipSize(currentSkip + pageSize);
        } else {
          setMayTinh(newItems);
          setSkipSize(pageSize);
        }

        setTotal(totalItems);
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
        if (!isLoadMore) setMayTinh([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [skipSize]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const formatKey = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

  // Component hiển thị card động
  const Card = ({ item }: { item: Record<string, any> }) => (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons
          name={
            (propertyClass?.iconMobile as keyof typeof Ionicons.glyphMap) ||
            "document-text-outline"
          }
          size={24}
          color="#0077CC"
        />
      </View>
      <View style={styles.info}>
        {fieldActive.map((field) => (
          <Text key={field.name} style={styles.text}>
            <Text style={styles.label}>{field.moTa}: </Text>
            {item[formatKey(field.name)] ?? "--"}
          </Text>
        ))}
      </View>
    </View>
  );

  const handleLoadMore = () => {
    if (maytinh.length < total && !isLoadingMore) {
      fetchData(true);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF3333" style={styles.loader} />
      ) : (
        <FlatList
          data={maytinh}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Card item={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color="#FF3333" />
            ) : null
          }
          ListHeaderComponent={
            <View style={styles.stickyHeader}>
              <Text style={styles.header}>
                Tổng số tài sản: {total} (Đã tải: {maytinh.length})
              </Text>
            </View>
          }
          stickyHeaderIndices={[0]}
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
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  loader: { flex: 1, justifyContent: "center" },
  header: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  stickyHeader: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    zIndex: 10,
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
  info: { flex: 1 },
  text: { fontSize: 14, color: "#4B5563", marginBottom: 2 },
  label: { fontWeight: "600", color: "#374151" },
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
