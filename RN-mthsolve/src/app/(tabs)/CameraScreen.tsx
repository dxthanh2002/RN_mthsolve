import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImageExpoPicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';


import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Button,
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
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [permission, requestPermission] = useCameraPermissions();

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);
    const cameraRef = useRef<CameraView | null>(null);




    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to use the camera
                </Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    const toggleFlash = () => {
        setFlashMode(current => {
            switch (current) {
                case 'off':
                    return 'on';
                case 'on':
                    return 'auto';
                case 'auto':
                    return 'off';
                default:
                    return 'off';
            }
        });
    };


    const getFlashIcon = () => {
        switch (flashMode) {
            case 'off':
                return 'flash-off';
            case 'on':
                return 'flash';
            case 'auto':
                return 'flash-outline';
            default:
                return 'flash-off';
        }
    };

    const pickImage = async () => {
        const result = await ImageExpoPicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setCapturedImage(result.assets[0].uri);
            setIsPreview(true);
        }
    };

    // const openGallery = async () => {
    //     try {
    //         const result = await ImagePicker.openPicker({
    //             cropping: true,
    //             mediaType: 'photo',
    //             includeBase64: false,
    //             freeStyleCropEnabled: true,
    //         });

    //         if (result) {
    //             setCroppedImage(result.path);
    //             await MediaLibrary.saveToLibraryAsync(result.path);

    //         }
    //     } catch (error) {
    //         console.error('Lỗi chọn ảnh:', error);
    //     }
    // }



    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
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
                        <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
                            <Ionicons name={getFlashIcon()} size={28} color="white" />
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

