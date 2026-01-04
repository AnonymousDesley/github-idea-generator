import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, Link } from 'expo-router';
import { Save, Github } from 'lucide-react-native';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (!email || !password || !username) {
            Alert.alert('Error', 'MISSING_FIELDS');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, full_name: username }
            }
        });
        if (error) {
            Alert.alert('Write Failed', error.message);
        } else {
            Alert.alert('Identity Created', 'VERIFICATION_REQUIRED');
            router.replace('/auth/login');
        }
        setLoading(false);
    };

    const handleOAuth = async (provider: 'google' | 'github') => {
        console.log(`[OAuth] Attempting ${provider} sign-in`);
        try {
            const redirectUrl = makeRedirectUri({
                scheme: 'gigai-mobile',
                path: 'auth/callback',
            });
            console.log(`[OAuth] Generated Redirect URL: ${redirectUrl}`);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });
            console.log('[OAuth] Supabase Response:', { data, error });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

                if (result.type === 'success' && result.url) {
                    const { queryParams } = Linking.parse(result.url);

                    const access_token = queryParams?.access_token as string;
                    const refresh_token = queryParams?.refresh_token as string;

                    if (access_token && refresh_token) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token,
                            refresh_token,
                        });
                        if (sessionError) throw sessionError;
                        router.replace('/');
                    }
                }
            }
        } catch (error: any) {
            console.error('[OAuth] Error:', error);
            Alert.alert('Authentication Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-transparent">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-8 bg-transparent">

                {/* 1. Centered Logo */}
                <View className="items-center mb-12">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        className="w-12 h-12"
                        resizeMode="contain"
                    />
                </View>

                {/* 2. Heading */}
                <Text className="text-3xl font-bold text-white mb-8 text-center tracking-tight">
                    Join GIGAI today.
                </Text>

                <View className="space-y-4 w-full max-w-sm mx-auto">
                    {/* 3. OAuth Buttons (Pill-shaped) */}
                    <TouchableOpacity
                        onPress={() => handleOAuth('google')}
                        className="bg-white py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
                    >
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                            style={{ width: 18, height: 18 }}
                        />
                        <Text className="text-black font-bold text-sm">Sign up with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleOAuth('github')}
                        className="bg-white py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-90"
                    >
                        <Github size={18} color="black" />
                        <Text className="text-black font-bold text-sm">Sign up with GitHub</Text>
                    </TouchableOpacity>

                    {/* 4. Divider */}
                    <View className="flex-row items-center gap-3 py-2">
                        <View className="flex-1 h-[1px] bg-zinc-800" />
                        <Text className="text-zinc-500 text-xs">or</Text>
                        <View className="flex-1 h-[1px] bg-zinc-800" />
                    </View>

                    {/* 5. Minimalist Inputs */}
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Name"
                        placeholderTextColor="#71717a"
                        className="bg-black border border-zinc-800 rounded px-4 py-4 text-white text-base focus:border-primary"
                    />

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#71717a"
                        autoCapitalize="none"
                        className="bg-black border border-zinc-800 rounded px-4 py-4 text-white text-base focus:border-primary"
                    />

                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        placeholderTextColor="#71717a"
                        secureTextEntry
                        className="bg-black border border-zinc-800 rounded px-4 py-4 text-white text-base focus:border-primary"
                    />

                    {/* 6. Create Account Button */}
                    <TouchableOpacity
                        onPress={handleSignup}
                        disabled={loading}
                        className="bg-white py-3 rounded-full items-center justify-center mt-2 active:opacity-90"
                    >
                        {loading ? <ActivityIndicator color="black" /> : (
                            <Text className="text-black font-bold text-sm">Create account</Text>
                        )}
                    </TouchableOpacity>

                    <Text className="text-zinc-600 text-xs mt-2 text-center leading-relaxed">
                        By signing up, you agree to our Terms of Service and Privacy Policy, including Cookie Use.
                    </Text>
                </View>

                {/* Footer */}
                <View className="mt-auto pt-10 flex-row justify-center gap-1">
                    <Text className="text-zinc-500 text-sm">Have an account already?</Text>
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary text-sm">Log in</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
