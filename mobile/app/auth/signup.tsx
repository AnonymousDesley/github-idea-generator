import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter, Link } from 'expo-router';
import { Mail, Lock, User, ArrowRight } from 'lucide-react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (!email || !password || !username) {
            Alert.alert('Missing Info', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Passwords Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                    full_name: username
                }
            }
        });
        if (error) {
            Alert.alert('Signup Failed', error.message);
        } else {
            Alert.alert('Account Created', 'Please check your email to verify your account.');
            router.replace('/auth/login');
        }
        setLoading(false);
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
                    <Text className="text-4xl font-bold text-white tracking-tighter mb-1">CREATE <Text className="text-primary italic">ACCOUNT</Text></Text>
                    <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-[6px]">Join the Network</Text>
                </View>

                <View className="gap-5 mb-10">
                    <View className="relative">
                        <View className="absolute left-5 top-5 z-10">
                            <User size={18} color="#52525b" />
                        </View>
                        <TextInput
                            value={username}
                            onChangeText={setUsername}
                            placeholder="USERNAME"
                            placeholderTextColor="#3f3f46"
                            className="bg-zinc-950 border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-mono text-xs focus:border-primary"
                        />
                    </View>

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

                    <View className="relative">
                        <View className="absolute left-5 top-5 z-10">
                            <Lock size={18} color="#52525b" />
                        </View>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="CONFIRM PASSWORD"
                            placeholderTextColor="#3f3f46"
                            secureTextEntry
                            className="bg-zinc-950 border border-zinc-800 p-5 pl-14 rounded-2xl text-white font-mono text-xs focus:border-primary"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSignup}
                        disabled={loading}
                        className="bg-white py-5 rounded-2xl flex-row justify-center items-center gap-3 mt-4"
                    >
                        {loading ? <ActivityIndicator color="black" /> : (
                            <>
                                <Text className="font-bold text-black uppercase tracking-[2px] text-xs">Sign Up</Text>
                                <ArrowRight size={18} color="black" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="items-center">
                    <Link href="/auth/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-zinc-500 font-mono text-[10px] tracking-wide">
                                ALREADY HAVE AN ACCOUNT? <Text className="text-primary font-bold">LOG IN</Text>
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
