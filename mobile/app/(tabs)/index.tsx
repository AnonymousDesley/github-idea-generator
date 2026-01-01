import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useGIGAI } from '../../hooks/useGIGAI';
import { Lightbulb, ArrowRight, Layers, Code, Database, LogOut } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function HomeScreen() {
    const { loading, ideas, actions } = useGIGAI();
    const [interest, setInterest] = useState('');
    const [userState] = useState({
        id: 'DEV_ALPHA',
        skills: ['TS', 'React Native'],
        level: 'Advanced',
    });

    const handleGenerate = () => {
        actions.suggestIdeas({
            user_id: userState.id,
            languages: userState.skills,
            experience_level: userState.level,
            interests: interest
        });
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Protocol Header */}
                <View className="mb-10 flex-row justify-between items-end">
                    <View>
                        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-[4px] mb-1">GIGAI PROTOCOL</Text>
                        <Text className="text-4xl font-bold text-white tracking-tighter">GIGAI</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => supabase.auth.signOut()}
                        className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full items-center justify-center"
                    >
                        <LogOut color="#71717a" size={18} />
                    </TouchableOpacity>
                </View>

                {/* Hero Input Area */}
                <View className="mb-12">
                    <Text className="text-white text-lg font-medium mb-4 ml-1">What are we building today?</Text>
                    <View className="relative">
                        <TextInput
                            value={interest}
                            onChangeText={setInterest}
                            placeholder="e.g. AI-driven task automation..."
                            placeholderTextColor="#3f3f46"
                            className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-white font-mono text-sm focus:border-primary"
                        />
                        <TouchableOpacity
                            onPress={handleGenerate}
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-white px-6 rounded-xl flex-row items-center justify-center"
                        >
                            {loading ? (
                                <ActivityIndicator color="black" size="small" />
                            ) : (
                                <ArrowRight color="black" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Results Section */}
                <View className="gap-6">
                    {ideas.length > 0 ? (
                        ideas.map((idea, index) => (
                            <View key={index} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl overflow-hidden relative">
                                <View className="absolute top-0 left-0 w-1 h-full bg-primary/20" />

                                <View className="flex-row items-center justify-between mb-4">
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-primary font-mono text-[9px] uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{idea.difficulty}</Text>
                                        <Text className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest">{idea.estimated_time}</Text>
                                    </View>
                                    <Layers color="#3f3f46" size={14} />
                                </View>

                                <Text className="text-xl font-bold text-white mb-3 tracking-tight">{idea.title}</Text>
                                <Text className="text-zinc-400 text-sm leading-relaxed mb-6 font-sans">
                                    {idea.description}
                                </Text>

                                <View className="flex-row flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
                                    {Array.isArray(idea.tech_stack) ? idea.tech_stack.slice(0, 4).map((tech: string, i: number) => (
                                        <View key={i} className="bg-black border border-zinc-800 px-3 py-1.5 rounded-lg">
                                            <Text className="text-[10px] font-mono text-zinc-300 uppercase letter-spacing-[1px]">{tech}</Text>
                                        </View>
                                    )) : null}
                                </View>
                            </View>
                        ))
                    ) : (
                        !loading && (
                            <View className="py-20 items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
                                <Database color="#18181b" size={40} className="mb-4" />
                                <Text className="text-zinc-600 font-mono text-[10px] uppercase tracking-[2px]">Awaiting Instructions...</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
