import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="pages/history" options={{ headerShown: false }} />
        <Stack.Screen name="pages/mail" options={{ headerShown: false }} />
        <Stack.Screen name="pages/remind" options={{ headerShown: false }} />
        <Stack.Screen name="pages/resolve" options={{
          headerShown: false,
          animation: "fade",
          presentation: "transparentModal",
        }} />
        <Stack.Screen
          name="setting/setting.modal"
          options={{
            headerShown: false,
            animation: "fade",
            presentation: "transparentModal",
          }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>


  );
}
