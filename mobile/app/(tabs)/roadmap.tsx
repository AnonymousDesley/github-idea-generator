import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useGIGAI } from '../../hooks/useGIGAI';
import { BookOpen, ArrowRight, Target } from 'lucide-react-native';

export default function RoadmapScreen() {
    const { loading, roadmap, actions } = useGIGAI();
    const [topic, setTopic] = useState('');

    const handleGenerate = () => {
        if (!topic) return;
        actions.generateRoadmap(topic);
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Protocol Header */}
                <View className="mb-10">
                    <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Module: PATH_FINDER</Text>
                    <Text className="text-3xl font-bold text-white tracking-tighter">LEARNING <Text className="text-primary italic">PATH</Text></Text>
                </View>

                {/* Objective Input Area */}
                <View className="mb-8">
                    <View className="relative">
                        <TextInput
                            value={topic}
                            onChangeText={setTopic}
                            placeholder="OBJECTIVE (e.g. RUST KERNEL DEV)"
                            placeholderTextColor="#3f3f46"
                            className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl text-white font-mono text-sm focus:border-primary"
                        />
                        <TouchableOpacity
                            onPress={handleGenerate}
                            disabled={loading || !topic}
                            className="absolute right-2 top-2 bottom-2 bg-primary px-6 rounded-xl flex-row items-center justify-center shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <ArrowRight color="white" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Trajectory Map */}
                {roadmap ? (
                    <View className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
                        <View className="absolute left-0 top-0 bottom-0 w-1 h-full bg-primary/20" />
                        <View className="flex-row items-center gap-2 mb-6">
                            <Target size={14} color="#3B82F6" />
                            <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Trajectory Calculated</Text>
                        </View>
                        <Text className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {roadmap}
                        </Text>
                    </View>
                ) : (
                    !loading && (
                        <View className="py-20 items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
                            <BookOpen color="#18181b" size={40} className="mb-4" />
                            <Text className="text-zinc-600 font-mono text-[10px] uppercase tracking-wider">Awaiting Objective...</Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
}
