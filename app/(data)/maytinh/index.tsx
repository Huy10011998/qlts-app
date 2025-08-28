import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
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
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "expo-router";
import IsLoading from "@/components/ui/IconLoading";
import { ListContainer, SearchBar } from "@/app/(dataClass)/list";
import { normalizeText } from "@/utils/helper";
interface PropertyClass {
  iconMobile: string;
}

export default function MayTinhScreen() {
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

  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  //  HANDLE PRESS ITEM
  const handlePress = async (item: Record<string, any>) => {
    try {
      // Hiển thị loading
      setIsLoading(true);

      const responseDetails = await getDetails(nameClass, item.id);
      setDetails(responseDetails);

      router.push({
        pathname: "/maytinh/details",
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

  //  FETCH DATA
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

  //  GỌI API LẦN ĐẦU
  useEffect(() => {
    fetchData();
    setIsFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DEBOUNCE TÌM KIẾM
  useEffect(() => {
    if (isFirstLoad) return;
    const timeout = setTimeout(() => {
      fetchData(false);
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // LOAD MORE
  const handleLoadMore = () => {
    if (maytinh.length < total && !isLoadingMore) {
      fetchData(true);
    }
  };

  // RENDER
  return (
    <View style={styles.container}>
      {isLoading ? (
        <IsLoading />
      ) : (
        <View>
          {isSearchOpen && (
            <SearchBar
              visible={true}
              value={searchText}
              onChange={(text) => setSearchText(normalizeText(text))}
            />
          )}
          <ListContainer
            data={maytinh}
            fields={fieldShowMobile}
            total={total}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            icon={propertyClass?.iconMobile || ""}
            onLoadMore={handleLoadMore}
            onItemPress={(item) => handlePress(item)}
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
