import React, { useEffect, useState, useMemo } from "react";
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
  TextInput,
} from "react-native";
import { FolderOpen, Folder, Pin } from "lucide-react-native";
import { API_ENDPOINTS } from "@/config";
import { useRouter } from "expo-router";
import { callApi, removeVietnameseTones } from "@/utils/helper";
import { useSearch } from "@/context/SearchContext";

// Bật LayoutAnimation cho Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Item {
  id: string | number;
  label: string;
  parent: string | number | null;
  parent_MoTa: string | null;
  typeGroup_MoTa: string;
  showCloseToogle: boolean;
  contentName: string | null;
  typeGroup: number;
  children: Item[];
  contentName_Mobile: string | null;
  stt: string | number;
}

interface GetMenuActiveResponse {
  data: Item[];
  success?: boolean;
  message?: string;
}

type Props = {
  item: Item;
  level?: number;
  expandedIds: (string | number)[];
  onToggle: (id: string | number) => void;
};

// Xử lý chuỗi không dấu + thường

const DropdownItem: React.FC<Props> = ({
  item,
  level = 0,
  expandedIds,
  onToggle,
}) => {
  const router = useRouter();
  const hasChildren = item.children && item.children.length > 0;
  const expanded = expandedIds.includes(item.id);

  const handlePress = () => {
    if (hasChildren) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onToggle(item.id);
    } else if (item.contentName_Mobile) {
      router.push(item.contentName_Mobile as any);
    }
  };

  return (
    <View style={{ paddingLeft: level > 0 ? 20 : 0, marginVertical: 4 }}>
      <Pressable
        onPress={handlePress}
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
        {item.contentName ? (
          <Pin size={18} color="red" />
        ) : expanded ? (
          <FolderOpen size={18} color="red" />
        ) : (
          <Folder size={18} color="red" />
        )}

        <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: "bold" }}>
          {item.label}
        </Text>
      </Pressable>

      {expanded && hasChildren && (
        <View style={{ marginTop: 4 }}>
          {item.children.map((child) => (
            <DropdownItem
              key={child.id}
              item={child}
              level={level + 1}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function TaiSanScreen() {
  const [data, setData] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>([]);

  const { isSearchOpen } = useSearch();

  // Xây dựng cây từ danh sách phẳng
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
        map[item.parent].children.push(map[item.id]);
      }
    });
    return roots;
  };

  // Lấy tất cả ID của node và children
  const collectAllIds = (items: Item[]): (string | number)[] => {
    const ids: (string | number)[] = [];
    const traverse = (nodes: Item[]) => {
      for (const node of nodes) {
        ids.push(node.id);
        if (node.children.length > 0) {
          traverse(node.children);
        }
      }
    };
    traverse(items);
    return ids;
  };

  // Lọc dữ liệu và tự động mở tất cả khi có kết quả tìm kiếm
  const filteredData = useMemo(() => {
    if (!search.trim()) {
      setExpandedIds([]); // Gom nhóm lại nếu không có tìm kiếm
      return data;
    }

    const keyword = removeVietnameseTones(search);

    const filterTree = (nodes: Item[]): Item[] => {
      return nodes
        .map((node) => {
          const match = removeVietnameseTones(node.label).includes(keyword);
          const filteredChildren = node.children.length
            ? filterTree(node.children)
            : [];
          if (match || filteredChildren.length > 0) {
            // Trả về node và tất cả con cháu của nó
            return { ...node, children: node.children };
          }
          return null;
        })
        .filter((n): n is Item => n !== null);
    };

    const result = filterTree(data);
    setExpandedIds(collectAllIds(result)); // Mở tất cả khi có kết quả
    return result;
  }, [search, data]);

  const handleToggle = (id: string | number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = (await callApi(
          "POST",
          API_ENDPOINTS.GET_MENU_ACTIVE,
          {}
        )) as GetMenuActiveResponse;

        // response là chính response.data trong callApi
        if (Array.isArray(response?.data)) {
          const menuAccount = response.data
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
      <ActivityIndicator
        size="large"
        color="#FF3333"
        style={{ justifyContent: "center", flex: 1 }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isSearchOpen && (
        <TextInput
          placeholder="Tìm kiếm..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            backgroundColor: "#fff",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
            margin: 12,
          }}
        />
      )}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DropdownItem
            item={item}
            expandedIds={expandedIds}
            onToggle={handleToggle}
          />
        )}
        contentContainerStyle={{
          paddingVertical: isSearchOpen ? 0 : 12,
          paddingHorizontal: 12,
        }}
      />
    </View>
  );
}
