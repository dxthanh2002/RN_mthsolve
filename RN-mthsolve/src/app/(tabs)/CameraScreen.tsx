import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';



import React, { useRef, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<CameraView | null>(null);


    // Request media library permission
    const requestMediaLibraryPermission = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        setMediaLibraryPermission(status === 'granted');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0].uri);
            setIsPreview(true);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: false,
                });
                setCapturedImage(photo.uri);
                setIsPreview(true);
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể chụp ảnh');
                console.error('Error taking picture:', error);
            }
        }
    };

    const savePhoto = async () => {
        if (!capturedImage) return;

        // Request permission if not granted yet
        if (mediaLibraryPermission === null) {
            await requestMediaLibraryPermission();
        }

        if (mediaLibraryPermission === false) {
            Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh để lưu');
            return;
        }

        try {
            await MediaLibrary.saveToLibraryAsync(capturedImage);
            Alert.alert('Thành công', 'Ảnh đã được lưu vào thư viện');
            setIsPreview(false);
            setCapturedImage(null);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu ảnh');
            console.error('Error saving photo:', error);
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setIsPreview(false);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    if (!permission) {
        // Camera permissions are still loading
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Đang tải...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={80} color="#666" />
                    <Text style={styles.message}>Cần quyền truy cập camera</Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Cấp quyền</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Preview screen after taking photo
    if (isPreview && capturedImage) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Image source={{ uri: capturedImage }} style={styles.preview} />
                <View style={styles.previewButtonContainer}>
                    <TouchableOpacity style={styles.previewButton} onPress={retakePhoto}>
                        <Ionicons name="camera" size={30} color="white" />
                        <Text style={styles.previewButtonText}>Chụp lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.previewButton} onPress={savePhoto}>
                        <Ionicons name="checkmark" size={30} color="white" />
                        <Text style={styles.previewButtonText}>Lưu ảnh</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Main camera screen
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.cameraContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>📷 Camera</Text>
                    </View>

                    {/* Camera Controls */}
                    <View style={styles.buttonContainer}>
                        {/* Library Camera Button */}
                        <TouchableOpacity style={styles.sideButton} onPress={pickImage}>
                            <AntDesign name="picture" size={24} color="white" />
                        </TouchableOpacity>

                        {/* Capture Button */}
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>

                        {/* Flip Camera Button */}
                        <TouchableOpacity style={styles.sideButton} onPress={toggleCameraFacing}>
                            <Ionicons name="camera-reverse-outline" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 30,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    sideButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
    },
    preview: {
        flex: 1,
    },
    previewButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingVertical: 40,
    },
    previewButton: {
        alignItems: 'center',
    },
    previewButtonText: {
        color: 'white',
        fontSize: 16,
        marginTop: 10,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 20,
        color: '#666',
        fontSize: 16,
    },
    permissionButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

