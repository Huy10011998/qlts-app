// app/(menus)/NestedDropdown.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Bật LayoutAnimation cho Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Item = {
  id: string | number;
  label: string;
  children?: Item[];
  parent_MoTa: string | null;
  typeGroup_MoTa: string;
  showCloseToogle: boolean;
  contentName: string;
  isActive: boolean;
  typeGroup: number;
  parent: string | null;
  icon: string | null;
  stt: string | number;
  isReport: string | null;
};

type Props = {
  item: Item;
  level?: number;
};

const DropdownItem: React.FC<Props> = ({ item, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={{ marginLeft: level * 16, marginVertical: 4 }}>
      <Pressable
        onPress={() => item.children && toggleExpand()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#fff",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#ddd",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        {item.children &&
          (expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "500" }}>
          {item.label}
        </Text>
      </Pressable>

      {expanded && item.children && (
        <View style={{ marginTop: 4 }}>
          {item.children.map((child) => (
            <DropdownItem key={child.id} item={child} level={level + 1} />
          ))}
        </View>
      )}
    </View>
  );
};

export default function NestedDropdownScreen() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm build cây từ danh sách phẳng
  const buildTree = (items: Item[]) => {
    const map: Record<string | number, Item> = {};
    const roots: Item[] = [];

    items.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parent === null) {
        roots.push(map[item.id]);
      } else if (map[item.parent]) {
        map[item.parent].children?.push(map[item.id]);
      }
    });

    return roots;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Lỗi", "Không tìm thấy token, vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        const response = await axios.post(
          "http://192.168.10.210:8869/api/Common/get-menu-active",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        if (response.status === 200 && Array.isArray(response.data.data)) {
          const menuAccount = response.data.data
            .filter((item: Item) => item.typeGroup === 0)
            .sort((a: Item, b: Item) => Number(a.stt) - Number(b.stt));

          const tree = buildTree(menuAccount);
          setData(tree);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }
      } catch (error) {
        if (__DEV__) console.error("API error:", error);
        Alert.alert("Lỗi", "Không thể tải dữ liệu menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <DropdownItem item={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
