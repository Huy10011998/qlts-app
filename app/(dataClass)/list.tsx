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
import { getFieldActive, getList, getPropertyClass } from "@/services";
import {
  Field,
  ListContainerProps,
  PropertyResponse,
  SearchBarProps,
} from "@/types";
import ListCardItem from "@/components/list/ListCardItem";
import { SqlOperator, TypeProperty } from "@/utils/enum";
import { useParams } from "@/hooks/useParams";

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

export default function ListContainer({ name, path }: ListContainerProps) {
  const [taisan, setTaiSan] = useState<Record<string, any>[]>([]);
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

  const { idRoot, nameClass: paramNameClass, propertyReference } = useParams();

  const nameClass = name || paramNameClass;

  const pageSize = 20;
  const searchInputRef = useRef<TextInput>(null);

  const conditions = useMemo(() => {
    return propertyReference && idRoot
      ? [
          {
            property: propertyReference,
            operator: SqlOperator.Equals,
            value: String(idRoot),
            type: TypeProperty.Int,
          },
        ]
      : [];
  }, [propertyReference, idRoot]);

  const handlePress = async (item: Record<string, any>) => {
    try {
      router.push({
        pathname: `/taisan/${path || "details"}` as any,
        params: {
          id: String(item.id),
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
      if (!nameClass) return;

      if (isLoadMore) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
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

        const response = await getList(
          nameClass,
          "",
          pageSize,
          currentSkip,
          searchText,
          fieldActive,
          conditions,
          []
        );

        const newItems: Record<string, any>[] = response?.data?.items || [];
        const totalItems = response?.data?.totalCount || 0;

        if (isLoadMore) {
          setTaiSan((prev) => [...prev, ...newItems]);
          setSkipSize(currentSkip + pageSize);
        } else {
          setTaiSan(newItems);
          setSkipSize(pageSize);
        }

        setTotal(totalItems);
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
        if (!isLoadMore) setTaiSan([]);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [nameClass, fieldActive, propertyClass, skipSize, searchText, conditions]
  );

  useEffect(() => {
    if (!nameClass) return;
    (async () => {
      await fetchData();
    })();
    setIsFirstLoad(false);
  }, [nameClass]);

  useEffect(() => {
    if (isFirstLoad || !nameClass) return;
    const timeout = setTimeout(() => {
      fetchData(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchText, nameClass]);

  const handleLoadMore = () => {
    if (taisan.length < total && !isLoadingMore) {
      fetchData(true);
    }
  };

  if (isLoading) return <IsLoading />;

  return (
    <View>
      {/* {isSearchOpen && (
        <SearchBar
          visible={true}
          value={searchText}
          onChange={(text) => setSearchText(normalizeText(text))}
        />
      )} */}
      <FlatList
        data={taisan}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ListCardItem
            item={item}
            fields={fieldShowMobile}
            icon={propertyClass?.iconMobile || ""}
            onPress={handlePress}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? <IsLoading /> : null}
        ListHeaderComponent={
          <View style={styles.stickyHeader}>
            <Text style={styles.header}>
              Tổng số tài sản: {total} (Đã tải: {taisan.length})
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
