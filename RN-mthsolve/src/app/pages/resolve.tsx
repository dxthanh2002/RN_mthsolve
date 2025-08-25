import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResolveScreen() {
    const { capturedImage } = useLocalSearchParams();
    const { width } = Dimensions.get("window");

    if (!capturedImage) {
        Alert.alert('Notification', 'No photos received');
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Animated.View
                entering={FadeIn}
                style={{
                    flex: 1,
                    justifyContent: 'flex-end',
                    backgroundColor: '#00000040',
                }}
            >
                <Pressable
                    onPress={() => router.back()}
                    style={StyleSheet.absoluteFill}
                />

                <Animated.View
                    entering={SlideInDown}
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 10,
                    }}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Xử Lý Ảnh</Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.img_container}>
                        {capturedImage ? (
                            <ImageBackground
                                source={{ uri: capturedImage as string }}
                                style={styles.img_background}
                                contentFit='fill'
                                blurRadius={20}
                            >
                                <Image
                                    source={{ uri: capturedImage as string }}
                                    style={styles.image}
                                    contentFit='contain'
                                    contentPosition={'top center'}
                                    onError={() => Alert.alert('Error', 'No photos received')}
                                />
                            </ImageBackground>
                        ) : (
                            <Text style={styles.message}>No photos received</Text>
                        )}

                    </View>

                </Animated.View>
            </Animated.View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    img_container: {
        marginTop: 5,
        marginHorizontal: 15,
        height: 180,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    img_background: {
        flex: 1,
        borderRadius: 20,
        borderColor: "gray",

    },
    image: {
        width: "100%",
        height: 180,
    },
    message: {
        fontSize: 16,
        color: 'red',
        marginVertical: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    uploadButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        marginTop: 20,
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});