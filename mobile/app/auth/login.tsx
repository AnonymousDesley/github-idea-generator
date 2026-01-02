import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Mail, Lock, Github, Chrome, ArrowRight } from 'lucide-react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) return;
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            router.replace('/(tabs)');
        }
        setLoading(false);
    };

    const handleOAuth = async (provider: 'github' | 'google') => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: 'gigai-mobile://auth-callback',
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, 'gigai-mobile://auth-callback');
                if (result.type === 'success' && result.url) {
                    const params = new URL(result.url).searchParams;
                    const access_token = params.get('access_token');
                    const refresh_token = params.get('refresh_token');

                    if (access_token && refresh_token) {
                        await supabase.auth.setSession({ access_token, refresh_token });
                        router.replace('/(tabs)');
                    }
                }
            }
        } catch (error: any) {
            Alert.alert('OAuth Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-black">
            {/* Background Grid */}
            <View className="absolute inset-0 opacity-40">
                <View className="absolute inset-0 flex-row justify-around">
                    {[...Array(12)].map((_, i) => (
                        <View key={i} className="w-[1px] h-full bg-zinc-900" />
                    ))}
                </View>
                <View className="absolute inset-0 flex-column justify-around">
                    {[...Array(24)].map((_, i) => (
                        <View key={i} className="h-[1px] w-full bg-zinc-900" />
                    ))}
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="p-6">
                <View className="mb-12 items-center">
                    <View className="mb-6 relative">
                        <View className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-3xl items-center justify-center rotate-3 overflow-hidden shadow-2xl shadow-primary/20">
                            <Image
                                source={require('../../../assets/images/logo.png')}
                                className="w-20 h-20 -rotate-3"
                                resizeMode="contain"
                            />
                        </View>
                        <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-4 border-black" />
                    </View>
                    <Text className="text-4xl font-bold text-white tracking-tighter mb-1">GIGAI</Text>
                    <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-[2px]">GitHub projects idea generator</Text>
                </View>

                <View className="gap-5 mb-6">
                    <View className="relative">
                        <View className="absolute left-5 top-5 z-10">
                            <Mail size={18} color="#52525b" />
                        </View>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="EMAIL ADDRESS"
                            placeholderTextColor="#3f3f46"
                            autoCapitalize="none"
                            className="bg-zinc-950 border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-mono text-xs focus:border-primary"
                        />
                    </View>

                    <View className="relative">
                        <View className="absolute left-5 top-5 z-10">
                            <Lock size={18} color="#52525b" />
                        </View>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="PASSWORD"
                            placeholderTextColor="#3f3f46"
                            secureTextEntry
                            className="bg-zinc-950 border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-mono text-xs focus:border-primary"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-white py-5 rounded-2xl flex-row justify-center items-center gap-3 mt-2"
                    >
                        {loading ? <ActivityIndicator color="black" /> : (
                            <View className="flex-row items-center gap-3">
                                <Text className="font-bold text-black uppercase tracking-[2px] text-xs">Log In</Text>
                                <ArrowRight size={18} color="black" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className="items-end mb-10 px-1">
                    <Text className="text-zinc-500 font-mono text-[10px] tracking-wide uppercase">Forgot password?</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-6 mb-10">
                    <View className="flex-1 h-[1px] bg-zinc-900" />
                    <Text className="text-zinc-600 font-mono text-[8px] tracking-[2px]">OR CONTINUE WITH</Text>
                    <View className="flex-1 h-[1px] bg-zinc-900" />
                </View>

                <View className="flex-row gap-4 mb-10">
                    <TouchableOpacity
                        onPress={() => handleOAuth('github')}
                        className="flex-1 bg-zinc-950 border border-zinc-800 py-4 rounded-2xl items-center justify-center flex-row gap-3"
                    >
                        <Github size={18} color="#FFFFFF" />
                        <Text className="text-white font-mono text-[10px] tracking-wider">GITHUB</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleOAuth('google')}
                        className="flex-1 bg-zinc-950 border border-zinc-800 py-4 rounded-2xl items-center justify-center flex-row gap-3"
                    >
                        <Chrome size={18} color="#EA4335" />
                        <Text className="text-white font-mono text-[10px] tracking-wider">GOOGLE</Text>
                    </TouchableOpacity>
                </View>

                <View className="items-center">
                    <Link href="/auth/signup" asChild>
                        <TouchableOpacity>
                            <Text className="text-zinc-500 font-mono text-[10px] tracking-wide">
                                NO ACCOUNT YET? <Text className="text-primary font-bold">SIGN UP</Text>
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
