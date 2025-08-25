import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Field,
  getFieldActive,
  getList,
  getPropertyClass,
} from "@/services/data/callApi";

// ======= HÀM LOẠI BỎ DẤU VÀ CHUYỂN CHỮ THƯỜNG =======
const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

interface PropertyClass {
  iconMobile: string;
}

export default function MayTinhList() {
  const [maytinh, setMayTinh] = useState<Record<string, any>[]>([]);
  const [fieldActive, setFieldActive] = useState<Field[]>([]);
  const [fieldShowMobile, setfieldShowMobile] = useState<Field[]>([]);
  const [propertyClass, setpropertyClass] = useState<PropertyClass>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skipSize, setSkipSize] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const nameClass = "MayTinh";
  const pageSize = 20;

  // ======= GỌI API =======
  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        // Lấy thông tin field
        const responseFieldActive = await getFieldActive(nameClass);
        const fieldActiveData = responseFieldActive?.data;
        setFieldActive(fieldActiveData);

        const fieldShowMobileData =
          responseFieldActive?.data?.filter((f: any) => f.isShowMobile) || [];
        setfieldShowMobile(fieldShowMobileData);

        // Lấy thông tin class
        const responsePropertyClass = await getPropertyClass(nameClass);
        setpropertyClass(responsePropertyClass?.data);

        // Lấy danh sách
        const currentSkip = isLoadMore ? skipSize : 0;
        const response = await getList(
          nameClass,
          "",
          pageSize,
          currentSkip,
          searchText,
          fieldActive,
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
    [fieldActive, searchText, skipSize]
  );

  // ======= GỌI API LẦN ĐẦU =======
  useEffect(() => {
    fetchData();
    setIsFirstLoad(false);
  }, []);

  // ======= DEBOUNCE TÌM KIẾM =======
  useEffect(() => {
    if (isFirstLoad) return; // Bỏ qua lần đầu tiên
    const timeout = setTimeout(() => {
      fetchData(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchText]);

  const formatKey = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

  // ======= CARD HIỂN THỊ ITEM =======
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
        {fieldShowMobile.map((field) => {
          const key =
            field.typeProperty === 6 ? `${field.name}_MoTa` : field.name;

          return (
            <Text key={field.name} style={styles.text}>
              <Text style={styles.label}>{field.moTa}: </Text>
              {item[formatKey(key)] ?? "--"}
            </Text>
          );
        })}
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
        <View>
          <TextInput
            placeholder="Tìm kiếm..."
            value={searchText}
            onChangeText={(text) => setSearchText(normalizeText(text))}
            style={styles.searchBox}
          />
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
        </View>
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
  text: { fontSize: 14, color: "#000", marginBottom: 2 },
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
  searchBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    margin: 12,
    backgroundColor: "#fff",
  },
});
