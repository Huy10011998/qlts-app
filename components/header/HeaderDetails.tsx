import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SearchIcon } from "../SearchButton";

type HeaderOptionsProps = {
  showBackButton?: boolean;
  showSearchButton?: boolean;
};

export const HeaderDetails = (
  props?: HeaderOptionsProps
): React.ComponentProps<typeof Stack.Screen>["options"] => {
  return {
    headerStyle: { backgroundColor: "#FF3333" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold" },
    headerLeft: () => (props?.showBackButton ? <HeaderBackButton /> : null),
    headerRight: () => (props?.showSearchButton ? <SearchIcon /> : null),
  };
};

function HeaderBackButton() {
  const navigation =
    useNavigation<NavigationProp<ReactNavigation.RootParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ paddingHorizontal: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
}
