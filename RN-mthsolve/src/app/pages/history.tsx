import { useApp } from "@/context/app.context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HistoryScreen: React.FC = () => {
  const { images, removeImage, clearImages } = useApp();

  const handleDelete = (uri: string) => {
    Alert.alert("Xóa ảnh?", "Bạn có chắc muốn xóa ảnh này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => removeImage(uri) },
    ]);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {

      }}
    >
      <Image source={{ uri: item }} style={styles.image} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>Giải pháp</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#666" />
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ảnh đã lưu</Text>
        {images.length > 0 && (
          <TouchableOpacity onPress={clearImages}>
            <Ionicons name="trash-bin-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {images.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chưa có ảnh nào được lưu.</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,

  },
  title: { fontSize: 20, fontWeight: "600" },
  list: { gap: 16 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 120 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  footerText: { fontSize: 16, fontWeight: "500", color: "#333" },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666" },
});
