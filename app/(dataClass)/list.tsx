import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Field, getFieldValue } from "@/utils/helper";
import IsLoading from "@/components/ui/IconLoading";

interface CardItemProps {
  item: Record<string, any>;
  fields: Field[];
  icon?: string;
  onPress: (item: Record<string, any>) => void;
}

interface SearchBarProps {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
}

interface ListContainerProps {
  data: Record<string, any>[];
  fields: Field[];
  total: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  icon?: string;
  onLoadMore: () => void;
  onItemPress: (item: Record<string, any>) => void;
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

export function ListContainer({
  data,
  fields,
  total,
  isLoading,
  isLoadingMore,
  icon,
  onLoadMore,
  onItemPress,
}: ListContainerProps) {
  if (isLoading) return <IsLoading />;

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <CardItem
          item={item}
          fields={fields}
          icon={icon}
          onPress={onItemPress}
        />
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isLoadingMore ? <IsLoading /> : null}
      ListHeaderComponent={
        <View style={styles.stickyHeader}>
          <Text style={styles.header}>
            Tổng số tài sản: {total} (Đã tải: {data.length})
          </Text>
        </View>
      }
      stickyHeaderIndices={[0]}
    />
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
