import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { normalizeText } from "@/utils/helper";
import IsLoading from "@/components/ui/IconLoading";
import { useRouter } from "expo-router";
import { getFieldActive, getPropertyClass } from "@/services";
import {
  Field,
  ListContainerProps,
  PropertyResponse,
  SearchInputProps,
} from "@/types";
import { SqlOperator, TypeProperty } from "@/utils/enum";
import { getListHistory } from "@/services/data/callApi";
import { useParams } from "@/hooks/useParams";
import orderBy from "lodash/orderBy";
import ListCardHistory from "@/components/list/ListCardHistory";

export function SearchBar({ visible, value, onChange }: SearchInputProps) {
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

export default function ListHistory({ name }: ListContainerProps) {
  const [lichsu, setLichsu] = useState<Record<string, any>[]>([]);
  const [fieldActive, setFieldActive] = useState<Field[]>([]);
  const [fieldShowMobile, setFieldShowMobile] = useState<Field[]>([]);
  const [propertyClass, setPropertyClass] = useState<PropertyResponse>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skipSize, setSkipSize] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const router = useRouter();

  const { id, nameClass: paramNameClass, propertyReference } = useParams();
  const nameClass = name || paramNameClass;

  const pageSize = 20;

  const searchInputRef = useRef<TextInput>(null);

  const conditions = useMemo(() => {
    return propertyReference && id
      ? [
          {
            property: propertyReference,
            operator: SqlOperator.Equals,
            value: id,
            type: TypeProperty.Int,
          },
        ]
      : [];
  }, [propertyReference, id]);

  const handlePress = async (item: Record<string, any>, index: number) => {
    const currentIndex = lichsu.findIndex((x) => x.id === item.id);
    const id_previous =
      currentIndex < lichsu.length - 1 ? lichsu[currentIndex + 1].id : null;

    try {
      router.push({
        pathname: "/taisan/related-details-history",
        params: {
          id: item.id,
          id_previous: id_previous,
          field: JSON.stringify(fieldActive),
          nameClass: nameClass,
        },
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", `Không thể tải chi tiết ${nameClass}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (!nameClass || !id) return;

      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        // Lấy field nếu lần đầu load
        if (!isLoadMore && fieldActive.length === 0) {
          const responseFieldActive = await getFieldActive(nameClass);
          const activeFields = responseFieldActive?.data || [];
          setFieldActive(activeFields);

          const showMobileFields = activeFields.filter(
            (f: any) => f.isShowMobile
          );
          setFieldShowMobile(showMobileFields);
        }

        if (!isLoadMore && !propertyClass) {
          const responsePropertyClass = await getPropertyClass(nameClass);
          setPropertyClass(responsePropertyClass?.data);
        }

        const currentSkip = isLoadMore ? skipSize : 0;

        // Lấy dữ liệu từ API
        const response = await getListHistory(id, nameClass);
        let newItems: Record<string, any>[] = response?.data || [];

        // Filter theo searchText nếu có
        if (searchText.trim() !== "") {
          const normalizedSearch = searchText.toLowerCase();
          newItems = newItems.filter((item) =>
            Object.values(item).some((value) =>
              String(value).toLowerCase().includes(normalizedSearch)
            )
          );
        }

        // Sắp xếp theo log_StartDate DESC
        newItems = orderBy(newItems, ["log_StartDate"], ["desc"]);

        const totalItems = newItems.length;

        if (isLoadMore) {
          setLichsu((prev) => [...prev, ...newItems]);
          setSkipSize(currentSkip + pageSize);
        } else {
          setLichsu(newItems);
          setSkipSize(pageSize);
        }

        setTotal(totalItems);
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
        if (!isLoadMore) setLichsu([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [nameClass, fieldActive.length, propertyClass, skipSize, id, searchText]
  );

  // Load data lần đầu
  useEffect(() => {
    if (!nameClass || !id) return;
    (async () => {
      await fetchData();
    })();
    setIsFirstLoad(false);
  }, [nameClass, id]);

  // Search debounce 500ms
  useEffect(() => {
    if (isFirstLoad || !nameClass) return;
    const timeout = setTimeout(() => {
      fetchData(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchText, nameClass]);

  const handleLoadMore = () => {
    if (lichsu.length < total && !isLoadingMore) {
      fetchData(true);
    }
  };

  if (isLoading) return <IsLoading />;

  return (
    <View>
      <FlatList
        data={lichsu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ListCardHistory
            item={item}
            fields={fieldShowMobile}
            icon={propertyClass?.iconMobile || ""}
            onPress={() => handlePress(item, index)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <IsLoading /> : null}
        ListHeaderComponent={
          <View style={styles.stickyHeader}>
            <Text style={styles.header}>
              Tổng số lịch sử: {total} (Đã tải: {lichsu.length})
            </Text>
          </View>
        }
        stickyHeaderIndices={[0]}
      />
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
  text: { fontSize: 14, color: "#000", marginBottom: 2 },
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
