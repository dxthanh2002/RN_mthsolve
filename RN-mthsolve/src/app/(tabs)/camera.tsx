import * as ImageManipulator from "expo-image-manipulator";
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
  TouchableOpacity,
  View
} from "react-native";

export default function CameraScreen() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
    })();
  }, []);

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setOriginalImage(asset.uri);
        setImageInfo({ width: asset.width, height: asset.height });
        setCroppedImage(null);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Lỗi', 'Không thể mở camera');
    }
  };

  // Crop presets cho các trường hợp thường gặp
  const cropPresets = [
    { name: 'Trung tâm', x: 0.1, y: 0.1, w: 0.8, h: 0.8 },
    { name: 'Nửa trên', x: 0, y: 0, w: 1, h: 0.5 },
    { name: 'Nửa dưới', x: 0, y: 0.5, w: 1, h: 0.5 },
    { name: 'Vuông giữa', x: 0.125, y: 0.2, w: 0.75, h: 0.6 },
  ];

  const cropWithPreset = async (preset: typeof cropPresets[0]) => {
    if (!originalImage || !imageInfo) return;

    try {
      const cropData = {
        originX: imageInfo.width * preset.x,
        originY: imageInfo.height * preset.y,
        width: imageInfo.width * preset.w,
        height: imageInfo.height * preset.h,
      };

      const cropped = await ImageManipulator.manipulateAsync(
        originalImage,
        [{ crop: cropData }],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCroppedImage(cropped.uri);

      // Lưu vào gallery
      await MediaLibrary.saveToLibraryAsync(cropped.uri);
      Alert.alert('Thành công', `Đã crop "${preset.name}" và lưu ảnh!`);

    } catch (error) {
      console.error('Crop error:', error);
      Alert.alert('Lỗi', 'Không thể crop ảnh');
    }
  };

  // Sử dụng editor mặc định của ImagePicker (đơn giản nhất)
  const openCameraWithEditor = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Bật editor mặc định
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setOriginalImage(result.assets[0].uri);
        setCroppedImage(result.assets[0].uri); // Ảnh đã được crop bằng editor

        // Lưu vào gallery
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        Alert.alert('Thành công', 'Đã chụp và crop ảnh!');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Lỗi', 'Không thể mở camera');
    }
  };

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
      console.log('Ready to upload:', croppedImage);
      Alert.alert('Demo', 'Sẵn sàng gửi lên backend!\nURI: ' + croppedImage);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi ảnh');
    }
  };

  const resetImages = () => {
    setOriginalImage(null);
    setCroppedImage(null);
    setImageInfo(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📱 Giải Toán - Camera</Text>

      <View style={styles.buttonContainer}>
        <Button title="📸 Chụp ảnh (Manual Crop)" onPress={openCamera} />
        <View style={styles.spacer} />
        <Button
          title="📸 Chụp ảnh (Auto Editor)"
          onPress={openCameraWithEditor}
          color="#e74c3c"
        />
      </View>

      {originalImage && !croppedImage && (
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Ảnh gốc:</Text>
          <Image
            source={{ uri: originalImage }}
            style={styles.preview}
            resizeMode="contain"
          />

          <Text style={styles.presetTitle}>Chọn vùng crop:</Text>
          <View style={styles.presetContainer}>
            {cropPresets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => cropWithPreset(preset)}
              >
                <Text style={styles.presetText}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {croppedImage && (
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Ảnh đã crop:</Text>
          <Image
            source={{ uri: croppedImage }}
            style={styles.preview}
            resizeMode="contain"
          />
          <View style={styles.actionButtons}>
            <Button
              title="📤 Gửi lên server"
              onPress={uploadImage}
              color="#27ae60"
            />
            <Button
              title="🔄 Chụp lại"
              onPress={resetImages}
              color="#f39c12"
            />
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: Dùng "Auto Editor" để crop nhanh hoặc "Manual Crop" để chọn vùng cụ thể
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  spacer: {
    height: 10,
  },
  imageSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e',
  },
  preview: {
    width: 280,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#bdc3c7',
    marginBottom: 15,
  },
  presetTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#7f8c8d',
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  presetButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  presetText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});