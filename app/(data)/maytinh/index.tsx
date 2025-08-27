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
  getDetails,
  getFieldActive,
  getList,
  getPropertyClass,
} from "@/services/data/callApi";
import { getFieldValue, normalizeText } from "@/utils/helper";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "expo-router";

interface PropertyClass {
  iconMobile: string;
}

export default function MayTinh() {
  const [maytinh, setMayTinh] = useState<Record<string, any>[]>([]);
  const [fieldActive, setFieldActive] = useState<Field[]>([]);
  const [fieldShowMobile, setFieldShowMobile] = useState<Field[]>([]);
  const [, setDetails] = useState();
  const [propertyClass, setPropertyClass] = useState<PropertyClass>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skipSize, setSkipSize] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const nameClass = "MayTinh";
  const pageSize = 20;

  const { isSearchOpen } = useSearch();
  const router = useRouter();

  // ======= HANDLE PRESS ITEM =======
  const handlePress = async (item: Record<string, any>) => {
    try {
      // Hiển thị loading
      setIsLoading(true);

      const responseDetails = await getDetails(nameClass, item.id);
      setDetails(responseDetails);

      router.push({
        pathname: "/maytinh/[id]",
        params: {
          id: item.id,
          item: JSON.stringify(responseDetails),
          field: JSON.stringify(fieldActive),
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể tải chi tiết máy tính");
    } finally {
      setIsLoading(false);
    }
  };

  // ======= FETCH DATA =======
  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        // Lấy Field nếu lần đầu
        if (!isLoadMore && fieldActive.length === 0) {
          const responseFieldActive = await getFieldActive(nameClass);
          const activeFields = responseFieldActive?.data || [];
          setFieldActive(activeFields);
          setFieldShowMobile(activeFields.filter((f: any) => f.isShowMobile));
        }

        // Lấy PropertyClass nếu lần đầu
        if (!isLoadMore && !propertyClass) {
          const responsePropertyClass = await getPropertyClass(nameClass);
          setPropertyClass(responsePropertyClass?.data);
        }

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
        console.log("===list", response);
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
    [fieldActive, searchText, skipSize, propertyClass]
  );

  // ======= GỌI API LẦN ĐẦU =======
  useEffect(() => {
    fetchData();
    setIsFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======= DEBOUNCE TÌM KIẾM =======
  useEffect(() => {
    if (isFirstLoad) return;
    const timeout = setTimeout(() => {
      fetchData(false);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // ======= LOAD MORE =======
  const handleLoadMore = () => {
    if (maytinh.length < total && !isLoadingMore) {
      fetchData(true);
    }
  };

  // ======= CARD ITEM =======
  const Card = ({ item }: { item: Record<string, any> }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
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
          return (
            <Text key={field.name} style={styles.text}>
              <Text style={styles.label}>{field.moTa}: </Text>
              {getFieldValue(item, field)}
            </Text>
          );
        })}
      </View>
    </TouchableOpacity>
  );

  // ======= RENDER =======
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#FF3333"
          style={{ justifyContent: "center", flex: 1 }}
        />
      ) : (
        <View>
          {isSearchOpen && (
            <TextInput
              placeholder="Tìm kiếm..."
              value={searchText}
              onChangeText={(text) => setSearchText(normalizeText(text))}
              style={styles.searchBox}
            />
          )}

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
  label: { fontWeight: "bold", color: "#000" },
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
