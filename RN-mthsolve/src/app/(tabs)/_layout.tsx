import { Colors } from '@/constants/Colors';
import {
  createNativeBottomTabNavigator,
  NativeBottomTabNavigationEventMap,
  NativeBottomTabNavigationOptions,
} from '@bottom-tabs/react-navigation';
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import { Platform } from 'react-native';

const cameraIcon = Ionicons.getImageSourceSync("camera-outline", 30);
const personIcon = Ionicons.getImageSourceSync("person-outline", 30);
const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;


const Tabs = withLayoutContext<
  NativeBottomTabNavigationOptions,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  NativeBottomTabNavigationEventMap
>(BottomTabNavigator);

// import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';



export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabLabelStyle={{ fontSize: 12 }}
      tabBarActiveTintColor={Colors[colorScheme ?? "light"].tint}
      tabBarInactiveTintColor="gray"
    >
      <Tabs.Screen
        name="CameraScreen"
        options={{
          title: 'Camera',
          tabBarIcon: () =>
            Platform.OS === "ios"
              ? ({ sfSymbol: "camera" })
              : cameraIcon!
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'User',
          tabBarIcon: () =>
            Platform.OS === "ios"
              ? ({ sfSymbol: "person" })
              : personIcon!
        }}
      />
    </Tabs >
  );
}
