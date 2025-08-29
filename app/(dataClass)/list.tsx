import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Field, getFieldValue, normalizeText } from "@/utils/helper";
import IsLoading from "@/components/ui/IconLoading";
import { useSearch } from "@/context/SearchContext";
import { useRouter } from "expo-router";
import { getFieldActive, getList, getPropertyClass } from "@/services";

interface CardItemProps {
  item: Record<string, any>;
  fields: Field[];
  icon?: string;
  onPress: (item: Record<string, any>) => void;
}

interface PropertyClass {
  iconMobile: string;
}

interface SearchBarProps {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
}

interface ListContainerProps {
  nameClass: string;
  pageSize: number;
}

export function CardItem({ item, fields, icon, onPress }: CardItemProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.avatar}>
        <Ionicons
          name={
            (icon as keyof typeof Ionicons.glyphMap) || "document-text-outline"
          }
          size={24}
          color="#0077CC"
        />
      </View>
      <View style={styles.info}>
        {fields.map((field) => (
          <Text key={field.name} style={styles.text}>
            <Text style={styles.label}>{field.moTa}: </Text>
            {getFieldValue(item, field)}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export function SearchBar({ visible, value, onChange }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <TextInput
      ref={inputRef}
      placeholder="Tìm kiếm..."
      value={value}
      onChangeText={onChange}
      style={styles.searchBox}
    />
  );
}

export function ListContainer({ nameClass, pageSize }: ListContainerProps) {
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
      router.push({
        pathname: "/maytinh/details",
        params: {
          id: item.id,
          field: JSON.stringify(fieldActive),
          nameClass: nameClass,
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
    [fieldActive, propertyClass, skipSize, nameClass, pageSize, searchText]
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
  if (isLoading) return <IsLoading />;

  return (
    <View>
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
          <FlatList
            data={maytinh}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <CardItem
                item={item}
                fields={fieldShowMobile}
                icon={propertyClass?.iconMobile || ""}
                onPress={(item) => handlePress(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoadingMore ? <IsLoading /> : null}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
