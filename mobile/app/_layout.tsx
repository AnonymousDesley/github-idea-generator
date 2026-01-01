import { Stack, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function Layout() {
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!session && !inAuthGroup) {
            // Redirect to login if not authenticated and not in auth group
            router.replace('/auth/login');
        } else if (session && inAuthGroup) {
            // Redirect to home if authenticated and in auth group
            router.replace('/(tabs)');
        }
    }, [session, initialized, segments]);

    if (!initialized) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <ActivityIndicator color="white" />
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-black">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="auth/login" options={{ headerShown: false }} />
                    <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
            </View>
        </SafeAreaProvider>
    );
}
