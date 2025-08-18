import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { FC } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MenuItemProps {
  title: string;
  onPress: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ title, onPress }) => {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </Pressable>
  );
};

const App: FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with icons */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}></View>
          <View style={styles.rightIcons}>
            <TouchableOpacity onPress={() => router.navigate("/pages/mail")}>
              <Ionicons name="mail-outline" size={30} color="#000" style={{ marginRight: 16 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/setting/setting.modal")}>
              <Ionicons name="menu" size={30} color="#000" />
            </TouchableOpacity>


          </View>
        </View>

        {/* Login */}
        <TouchableOpacity style={styles.loginRow}>
          <Text style={styles.title}>Login</Text>
          <Ionicons name="chevron-forward" size={22} color="#999" />
        </TouchableOpacity>

        {/* Free trial */}
        <Pressable style={styles.trialContainer} onPress={() => router.navigate("/pages/remind")}>
          <View>
            <Text style={styles.trialBadge}>Free Trial</Text>
            <View style={styles.plusContainer}>
              <Text style={styles.plusText}>G </Text>
              <Text style={styles.plusTag}>PLUS</Text>
            </View>
            <Text style={styles.desc}>Subscribe to receive exclusive benefits</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{ flexDirection: "row", alignItems: "center" }}

            >
              {/* <Text style={styles.unlock}>Unlock</Text> */}
              <Ionicons name="chevron-forward" size={22} color="#999" />
            </View>
          </View>
        </Pressable>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem title="Q&A History" onPress={() => router.navigate("/pages/history")} />
          <MenuItem title="Reminders" onPress={() => router.navigate("/pages/history")} />
          <MenuItem title="Feedback" onPress={() => router.navigate("/pages/history")} />
        </View>

        {/* Invite friends */}
        <View style={styles.inviteContainer}>
          <View style={styles.inviteHeader}>
            <Text style={styles.inviteTitle}>Invite Friends</Text>
            <Text style={styles.freePoints}>Free Points</Text>
          </View>
          <Text style={styles.progress}>1   2   3   4   5 → 🎁 100</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9fb",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  trialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "lightgray",
    borderRadius: 30,
    padding: 16,
    marginBottom: 20,
  },
  trialBadge: {
    backgroundColor: "#f9c74f",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  plusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  plusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plusTag: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "#333",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  desc: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },
  unlock: {
    color: "#3f51b5",
    fontWeight: "bold",
    fontSize: 14,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
  },
  inviteContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  inviteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  freePoints: {
    fontSize: 12,
    color: "#d62828",
    marginLeft: 8,
  },
  progress: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  shareBtn: {
    backgroundColor: "#f1f3f6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  shareText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
