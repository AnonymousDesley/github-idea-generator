import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, SafeAreaView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, ExternalLink, Calendar, Code, Activity } from 'lucide-react-native';
import { ProjectIdea } from '../types/api';
import { LinearGradient } from 'expo-linear-gradient';

interface ProjectModalProps {
    idea: ProjectIdea | null;
    onClose: () => void;
}

export default function ProjectModal({ idea, onClose }: ProjectModalProps) {
    if (!idea) return null;

    const diffColor =
        idea.difficulty === 'Advanced' ? 'text-red-400 border-red-400 bg-red-400/10' :
            idea.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10' :
                'text-emerald-400 border-emerald-400 bg-emerald-400/10';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={!!idea}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/80">
                <BlurView intensity={20} className="flex-1 justify-center items-center p-4">
                    <View className="w-full max-w-lg bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">

                        {/* Header */}
                        <View className="flex-row justify-between items-center p-5 border-b border-zinc-800 bg-zinc-900/50">
                            <View className="flex-row items-center gap-2">
                                <View className="w-2 h-2 rounded-full bg-primary" />
                                <Text className="text-zinc-400 font-mono text-xs tracking-widest uppercase">
                                    PROJECT_CLASSIFIED
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                                <X size={20} color="#71717a" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="max-h-[70vh]">
                            <View className="p-6 space-y-6">
                                {/* Title & Stats */}
                                <View>
                                    <View className="flex-row gap-2 mb-4">
                                        <View className={`px-2 py-0.5 rounded border ${diffColor.split(' ').slice(1).join(' ')}`}>
                                            <Text className={`text-[10px] font-mono tracking-widest uppercase ${diffColor.split(' ')[0]}`}>
                                                {idea.difficulty}
                                            </Text>
                                        </View>
                                        <View className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded flex-row items-center gap-1.5">
                                            <Calendar size={10} color="#71717a" />
                                            <Text className="text-[10px] text-zinc-400 font-mono">{idea.estimated_time}</Text>
                                        </View>
                                    </View>

                                    <Text className="text-2xl font-bold text-white leading-tight mb-2">
                                        {idea.title}
                                    </Text>
                                </View>

                                {/* Description */}
                                <View className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
                                    <Text className="text-zinc-300 leading-relaxed text-sm">
                                        {idea.description}
                                    </Text>
                                </View>

                                {/* Tech Stack */}
                                <View className="space-y-3">
                                    <View className="flex-row items-center gap-2">
                                        <Code size={14} color="#a1a1aa" />
                                        <Text className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Tech Stack</Text>
                                    </View>
                                    <View className="flex-row flex-wrap gap-2">
                                        {(Array.isArray(idea.tech_stack)
                                            ? idea.tech_stack
                                            : Object.values(idea.tech_stack).flat()
                                        ).map((tech, i) => (
                                            <View key={i} className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md">
                                                <Text className="text-xs text-zinc-300 font-mono">{String(tech)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Footer Actions */}
                        <View className="p-5 border-t border-zinc-800 bg-zinc-900/30 gap-3">
                            <TouchableOpacity
                                className="bg-primary py-3.5 rounded-xl justify-center items-center flex-row gap-2"
                                onPress={onClose}
                            >
                                <Activity size={16} color="white" />
                                <Text className="text-white font-bold text-sm tracking-wide">INITIATE SEQUENCE</Text>
                            </TouchableOpacity>

                            <Text className="text-center text-[10px] text-zinc-600 font-mono">
                                SECURE_CHANNEL_ESTABLISHED
                            </Text>
                        </View>
                    </View>
                </BlurView>
            </View>
        </Modal>
    );
}
