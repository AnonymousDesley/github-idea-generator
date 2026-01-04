import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '../hooks/useColorScheme';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackgroundGrid from '../components/BackgroundGrid';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const loaded = true; // Synced with system fonts

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider value={DarkTheme}>
                <View style={styles.container}>
                    {/* Layer -10: Background */}
                    <BackgroundGrid />

                    {/* Layer 1+: Content */}
                    <Stack screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent' }, // Transparent to show grid
                        animation: 'fade'
                    }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="auth/login" />
                        <Stack.Screen name="auth/signup" />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar barStyle="light-content" />
                </View>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
});
