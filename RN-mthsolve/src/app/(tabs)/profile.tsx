import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9fb" }}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Đăng nhập */}
        <Text style={styles.title}>Đăng nhập</Text>

        {/* Dùng thử miễn phí */}
        <View style={styles.trialContainer}>
          <Text style={styles.trialBadge}>Dùng thử miễn phí</Text>
          <View style={styles.plusContainer}>
            <Text style={styles.plusText}>Gauth </Text>
            <Text style={styles.plusTag}>PLUS</Text>
          </View>
          <Text style={styles.desc}>Đăng ký để nhận các lợi ích độc quyền</Text>
          <TouchableOpacity>
            <Text style={styles.unlock}>Mở khóa</Text>
          </TouchableOpacity>
        </View>

        {/* Danh mục */}
        <View style={styles.menu}>
          <MenuItem title="Lịch sử hỏi đáp" />
          <MenuItem title="Lời nhắc" />
          <MenuItem title="Phản hồi" />
        </View>

        {/* Mời bạn bè */}
        <View style={styles.inviteContainer}>
          <View style={styles.inviteHeader}>
            <Text style={styles.inviteTitle}>Mời bạn bè</Text>
            <Text style={styles.freePoints}>Điểm miễn phí</Text>
          </View>
          <Text style={styles.progress}>1 - 2 - 3 - 4 - 5 → 🎁 100</Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

type MenuItemProps = {
  title: string;
};

function MenuItem({ title }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  trialContainer: {
    backgroundColor: "#eef1ff",
    borderRadius: 12,
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
    padding: 16,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
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
