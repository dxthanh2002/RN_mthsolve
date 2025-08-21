import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CameraType, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import * as ImageExpoPicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from "react-native-image-crop-picker";

import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
    Alert,
    AppState,
    Button,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [flashMode, setFlashMode] = useState<FlashMode>('off');
    const [permission, requestPermission] = useCameraPermissions();

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | null>(null);

    // ✅ SOLUTION 1: États pour gérer le focus de la caméra
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isTabFocused, setIsTabFocused] = useState(true);
    const [appState, setAppState] = useState(AppState.currentState);

    const cameraRef = useRef<CameraView | null>(null);

    // ✅ SOLUTION 2: Gérer le focus/blur du tab avec useFocusEffect
    useFocusEffect(
        useCallback(() => {
            // Quand le tab devient actif
            setIsTabFocused(true);
            setIsCameraReady(false);

            // Petit délai pour s'assurer que le composant est monté
            const timer = setTimeout(() => {
                setIsCameraReady(true);
            }, 100);

            return () => {
                // Quand on quitte le tab
                setIsTabFocused(false);
                setIsCameraReady(false);
                clearTimeout(timer);
            };
        }, [])
    );

    // ✅ SOLUTION 3: Gérer les changements d'état de l'app (background/foreground)
    useFocusEffect(
        useCallback(() => {
            const subscription = AppState.addEventListener('change', (nextAppState) => {
                if (appState.match(/inactive|background/) && nextAppState === 'active') {
                    // App revient au premier plan
                    setIsCameraReady(false);
                    setTimeout(() => setIsCameraReady(true), 200);
                }
                setAppState(nextAppState);
            });

            return () => subscription?.remove();
        }, [appState])
    );

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

    // ✅ SOLUTION 4
    const refreshCamera = () => {
        setIsCameraReady(false);
        setTimeout(() => {
            setIsCameraReady(true);
        }, 100);
    };

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
        try {
            const { status } = await ImageExpoPicker.getMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                const { status: newStatus } = await ImageExpoPicker.requestMediaLibraryPermissionsAsync();
                if (newStatus !== 'granted') {
                    Alert.alert('Permission refusée', 'Accès à la galerie nécessaire');
                    return;
                }
            }

            const result = await ImageExpoPicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                setCapturedImage(result.assets[0].uri);
                setIsPreview(true);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Erreur', 'Impossible d\'ouvrir la galerie');
        }
    };

    const openGallery = async () => {
        try {
            const result = await ImagePicker.openPicker({
                cropping: true,
                mediaType: 'photo',
                includeBase64: false,
                freeStyleCropEnabled: true,
            });

            if (result) {
                setCapturedImage(result.path);
                setIsPreview(true);

                // const { status } = await MediaLibrary.getPermissionsAsync();
                // if (status !== 'granted') {
                //     const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                //     if (newStatus !== 'granted') {
                //         Alert.alert('Permission refuse', 'Impossible de sauvegarder sans permission');
                //         return;
                //     }
                // }
                // await MediaLibrary.saveToLibraryAsync(result.path);
                // Alert.alert('Success', 'Image save in the gallery');
            }
        } catch (error: any) {
            if (error.code === 'E_PICKER_CANCELLED') {
                router.replace("/(tabs)/CameraScreen");
            } else {
                console.error("Open gallery error:", error);
                Alert.alert('Erreur', 'Erreur lors de l\'ouverture de la galerie');
            }
        }
    };

    const takePicture = async () => {
        if (cameraRef.current && isCameraReady) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                });

                try {
                    const image = await ImagePicker.openCropper({
                        mediaType: 'photo',
                        path: photo.uri,
                        width: 300,
                        height: 400,
                        cropping: true,
                        freeStyleCropEnabled: true,
                    });
                    setCapturedImage(image.path);
                    setIsPreview(true);
                } catch (cropError) {
                    setCapturedImage(photo.uri);
                    setIsPreview(true);
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể chụp ảnh. Thử làm mới camera.');
                console.error('Error taking picture:', error);
                // ✅ Auto-refresh camera en cas d'erreur
                refreshCamera();
            }
        } else {
            // ✅ Si camera pas prête, essayer de la réinitialiser
            Alert.alert('Camera không sẵn sàng', 'Đang khởi động lại camera...', [
                { text: 'OK', onPress: refreshCamera }
            ]);
        }
    };

    const savePhoto = async () => {
        if (!capturedImage) return;

        try {
            const { status } = await MediaLibrary.getPermissionsAsync();

            if (status !== 'granted') {
                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    Alert.alert('Permission refusée', 'Accès à la galerie nécessaire pour sauvegarder');
                    return;
                }
            }

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
                <Image source={{ uri: capturedImage }} style={styles.preview} resizeMode='contain' />

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

    //Loading screen 
    if (!isTabFocused || !isCameraReady) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Ionicons name="camera-outline" size={50} color="#666" />
                    <Text style={styles.loadingText}>Khởi động camera...</Text>
                </View>
            </View>
        );
    }

    // Main camera screen
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                flash={flashMode}
                onCameraReady={() => setIsCameraReady(true)} // ✅ Callback camera
            >
                <View style={styles.cameraContainer}>
                    {/* Header avec bouton refresh */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>📷 Camera</Text>
                        {/* ✅ SOLUTION 6: Bouton refresh manuel */}
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={refreshCamera}
                        >
                            <Ionicons name="refresh" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Camera Controls */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.sideButton} onPress={openGallery}>
                            <AntDesign name="picture" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureButtonInner} />
                        </TouchableOpacity>

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
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    headerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    // ✅ NOUVEAU: Style pour bouton refresh
    refreshButton: {
        position: 'absolute',
        right: 20,
        top: 60,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ✅ NOUVEAU: Loading screen
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#666',
        fontSize: 16,
        marginTop: 15,
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
        width: "100%",
        height: "100%",
        backgroundColor: "black",

    },
    previewButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
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