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

  // Permissions
  useEffect(() => {
    const requestPermissions = async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    };
    requestPermissions();
  }, []);

  // Camera functions
  const openCameraWithEditor = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setCroppedImage(result.assets[0].uri);
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        Alert.alert('Thành công', 'Đã chụp và crop ảnh!');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Lỗi', 'Không thể mở camera');
    }
  };

  const retakePhoto = () => {
    setCroppedImage(null);
  };

  // Upload function
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

      // Thay YOUR_BACKEND_URL bằng URL backend thực tế
      // const response = await fetch('YOUR_BACKEND_URL/upload', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: formData,
      // });

      // if (response.ok) {
      //   const result = await response.json();
      //   Alert.alert('Thành công', 'Đã gửi ảnh lên server!');
      //   console.log('Upload result:', result);
      // } else {
      //   Alert.alert('Lỗi', 'Không thể gửi ảnh');
      // }

      // Mock success for demo
      console.log('Ready to upload:', croppedImage);
      Alert.alert('Demo', 'Sẵn sàng gửi lên backend!');

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi ảnh');
    }
  };

  // Render functions
  const renderCameraSection = () => (
    <View style={styles.cameraSection}>
      <View style={styles.cameraButtonContainer}>
        <Button
          title="📸 Chụp ảnh bài toán"
          onPress={openCameraWithEditor}
          color="#3498db"
        />
      </View>
    </View>
  );

  const renderResultSection = () => (
    <View style={styles.resultSection}>
      <Text style={styles.sectionTitle}>✅ Ảnh bài toán đã crop:</Text>
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

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Đảm bảo bài toán rõ ràng và đủ sáng
      </Text>
    </View>
  );

  // Main render
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>📱 Giải Toán</Text>
      <Text style={styles.subtitle}>Chụp ảnh bài toán để giải</Text>

      {!croppedImage ? renderCameraSection() : renderResultSection()}

      {renderFooter()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
    minHeight: '100%',
    justifyContent: 'center',
  },

  // Header styles
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

  // Camera section styles
  cameraSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cameraButtonContainer: {
    width: '80%',
  },

  // Result section styles
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

  // Footer styles
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