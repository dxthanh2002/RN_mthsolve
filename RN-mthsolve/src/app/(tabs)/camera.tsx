import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function CameraScreen() {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  useEffect(() => {
    const initializeCamera = async () => {
      // Yêu cầu các quyền cần thiết
      await ImagePicker.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    };
    initializeCamera();
  }, []);

  // Hàm mở camera và cho phép chỉnh sửa (cắt ảnh)
  const openCameraWithEditor = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setCroppedImage(result.assets[0].uri);
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        Alert.alert('Thành công', 'Đã chụp và cắt ảnh!');
      }
    } catch (error) {
      console.error('Lỗi Camera:', error);
      Alert.alert('Lỗi', 'Không thể mở camera');
    }
  };

  // [MODIFIED] Hàm để chụp lại ảnh, giờ sẽ mở thẳng camera
  const retakePhoto = () => {
    openCameraWithEditor();
  };

  // Hàm tải ảnh lên server (hiện tại là giả lập)
  const uploadImage = async () => {
    if (!croppedImage) {
      Alert.alert('Lỗi', 'Chưa có ảnh để gửi');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: croppedImage,
        type: 'image/jpeg',
        name: 'math_problem.jpg',
      } as any);

      // Giả lập việc gửi thành công để demo
      console.log('Sẵn sàng để tải lên:', croppedImage);
      Alert.alert('Demo', 'Sẵn sàng gửi lên backend!');

    } catch (error) {
      console.error('Lỗi tải lên:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi ảnh');
    }
  };

  // --- Các hàm render giao diện ---

  // Giao diện này giờ là phương án dự phòng nếu người dùng hủy camera lần đầu
  const renderCameraSection = () => (
    <View style={styles.cameraSection}>
      <View style={styles.cameraButtonContainer}>
        <Button
          title="📸 Mở lại Camera"
          onPress={openCameraWithEditor}
          color="#3498db"
        />
      </View>
    </View>
  );

  // Render giao diện sau khi đã có ảnh đã cắt
  const renderResultSection = () => (
    <View style={styles.resultSection}>
      <Text style={styles.sectionTitle}>✅ Ảnh bài toán đã chọn:</Text>
      {croppedImage && (
        <Image
          source={{ uri: croppedImage }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}

      <View style={styles.actionButtons}>
        <Button
          title="📤 Gửi lên server để giải"
          onPress={uploadImage}
          color="#27ae60"
        />
        <Button
          title="📸 Chụp lại"
          onPress={retakePhoto}
          color="#e74c3c"
        />
      </View>
    </View>
  );

  // Render phần footer hướng dẫn
  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Mẹo: Hãy đảm bảo ảnh chụp rõ nét và đủ sáng
      </Text>
    </View>
  );

  // Render chính của component
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>📱 Giải Toán AI</Text>
      <Text style={styles.subtitle}>Chụp ảnh bài toán để nhận lời giải</Text>

      {!croppedImage ? renderCameraSection() : renderResultSection()}

      {renderFooter()}
    </ScrollView>
  );
}

// --- StyleSheet ---
const styles = StyleSheet.create({
  // Kiểu cho container
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
    minHeight: '100%',
    justifyContent: 'center',
  },

  // Kiểu cho tiêu đề
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },

  // Kiểu cho khu vực camera
  cameraSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cameraButtonContainer: {
    width: '80%',
  },

  // Kiểu cho khu vực kết quả
  resultSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#27ae60',
    textAlign: 'center',
  },
  preview: {
    width: 300,
    height: 250,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#27ae60',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  actionButtons: {
    width: '100%',
    gap: 15,
  },

  // Kiểu cho footer
  footer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  footerText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
