import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItemString } from "@/types";
import { getClassReference } from "@/services/data/callApi";
import IsLoading from "@/components/ui/IconLoading";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function DeTailsTab() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const nameClass = params.nameClass as string;
  const id = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<MenuItemString[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        if (!id || !nameClass) throw new Error("Thiếu ID hoặc nameClass");

        const response = await getClassReference(nameClass);
        const data = response?.data;

        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        setItems(
          data.map((item: any) => {
            const iconName = item.iconMobile as keyof typeof Ionicons.glyphMap;
            return {
              id: String(item.id),
              name: item.name || "", // <-- thêm name để truyền qua params
              label: item.moTa || "Không có mô tả",
              icon: Ionicons.glyphMap[iconName]
                ? iconName
                : ("document-text-outline" as keyof typeof Ionicons.glyphMap),
            };
          })
        );
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", `Không thể tải chi tiết ${nameClass}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [nameClass, id]);

  const handlePress = (item: MenuItemString) => {
    router.push({
      pathname: "/(data)/taisan/related-list", // đường dẫn tới màn hình đích
      params: {
        name: item.name, // truyền name
      },
    });
  };

  const renderItem = ({ item }: { item: MenuItemString }) => (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.7}
      onPress={() => handlePress(item)}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color="#FF3333"
        style={styles.icon}
      />
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <IsLoading />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text>Không có dữ liệu</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 56,
  },
});
