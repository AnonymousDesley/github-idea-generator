import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProjectIdea } from '../types/api';

export default function ProjectCard({ idea, index, onPress, style }: { idea: ProjectIdea; index: number; onPress?: () => void; style?: any }) {
    const diffColor =
        idea.difficulty === 'Advanced' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
            idea.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.9}
            style={[style]}
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg overflow-hidden relative"
        >
            {/* Glow Effect */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10" />

            <View className="flex-row justify-between items-start mb-4">
                <View className={`px-2 py-0.5 rounded border ${diffColor.split(' ').slice(1).join(' ')}`}>
                    <Text className={`text-[10px] font-mono tracking-widest uppercase ${diffColor.split(' ')[0]}`}>
                        {idea.difficulty}
                    </Text>
                </View>
                <Text className="text-[10px] font-mono text-zinc-500">{idea.estimated_time}</Text>
            </View>

            <Text className="text-lg font-bold text-white mb-2 leading-tight">
                {idea.title}
            </Text>

            <Text className="text-sm text-zinc-400 leading-relaxed mb-6" numberOfLines={3}>
                {idea.description}
            </Text>

            <View className="flex-row flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
                {(Array.isArray(idea.tech_stack)
                    ? idea.tech_stack
                    : typeof idea.tech_stack === 'object' && idea.tech_stack !== null
                        ? Object.values(idea.tech_stack).flat()
                        : [idea.tech_stack]
                ).map((tech, i) => (
                    <View key={i} className="bg-black border border-zinc-800 px-2 py-1 rounded">
                        <Text className="text-[10px] text-zinc-400 font-mono">
                            {String(tech)}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );
}
