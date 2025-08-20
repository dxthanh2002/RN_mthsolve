
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from "react";
import { View } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


const RootPage = () => {
    const [state, setState] = useState<any>();

    // useEffect(() => {
    //     async function prepare() {
    //         try {
    //             // Pre-load fonts, make any API calls you need to do here
    //             const res = await getAccountAPI();

    //             if (res.data) {
    //                 //success
    //                 setAppState({
    //                     user: res.data.user,
    //                     access_token: await AsyncStorage.getItem("access_token")
    //                 })
    //                 router.replace("/(tabs)");

    //             } else {
    //                 //error
    //                 router.replace("/(auth)/welcome");
    //             }

    //         } catch (e) {
    //             setState(() => {
    //                 throw new Error('Không thể kết tới API Backend...')
    //             })
    //         } finally {
    //             // Tell the application to render
    //             await 
    //         }
    //     }

    //     prepare();
    // }, []);

    SplashScreen.hideAsync();
    if (true) {
        return (
            <Redirect href={"/(tabs)/CameraScreen"} />
        )
    }
    return (
        <>
            <View>
                <></>
            </View>

        </>
    )
}

export default RootPage;