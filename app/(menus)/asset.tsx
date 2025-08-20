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
import { FolderOpen, Folder, Pin } from "lucide-react-native";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config";

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
  contentName: string | null;
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

  const hasChildren = item.children && item.children.length > 0;
  const isPinned = item.contentName === null; // điều kiện để hiện icon ghim

  return (
    <View style={{ paddingLeft: level > 0 ? 20 : 0, marginVertical: 4 }}>
      <Pressable
        onPress={() => hasChildren && toggleExpand()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderRadius: 8,
          borderWidth: 1,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        {hasChildren ? (
          expanded ? (
            <FolderOpen size={18} color="red" />
          ) : (
            <Folder size={18} color="red" />
          )
        ) : !isPinned ? (
          <Pin size={18} color="red" />
        ) : null}

        <Text
          style={{
            marginLeft: 6,
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          {item.label}
        </Text>
      </Pressable>

      {expanded && hasChildren && (
        <View style={{ marginTop: 4 }}>
          {item.children?.map((child) => (
            <DropdownItem key={child.id} item={child} level={level + 1} />
          ))}
        </View>
      )}
    </View>
  );
};

export default function NestedDropdownScreen() {
  const [data, setData] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // build tree từ danh sách phẳng
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
        const response = await api.post(API_ENDPOINTS.GET_MENU_ACTIVE, {});

        if (Array.isArray(response?.data?.data)) {
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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <DropdownItem item={item} />}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}
