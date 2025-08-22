// App.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>General data</Text>

        <View style={styles.item}>
          <Text style={styles.label}>Action</Text>
          <Text style={styles.value}>-</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>
            CM.2020.0003 - Emergency light broken.
          </Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Opening date</Text>
          <Text style={styles.value}>2020-08-30 22:53</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Requester</Text>
          <Text style={styles.value}>Garret Damian</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>Breakdown</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Site</Text>
          <Text style={styles.value}>WB02 - Office Building 02</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="document-text-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="link-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail-outline" size={24} color="white" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="attach-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#b88c3a",
    marginBottom: 15,
  },
  item: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginTop: 3,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#b88c3a",
    paddingVertical: 10,
  },
  iconButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: "blue",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default App;
