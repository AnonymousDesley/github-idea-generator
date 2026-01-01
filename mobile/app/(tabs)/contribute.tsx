import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useGIGAI } from '../../hooks/useGIGAI';
import { Github, ArrowUpRight, Radar } from 'lucide-react-native';

export default function ContributeScreen() {
    const { loading, issues, actions } = useGIGAI();
    const [skills] = useState(['JavaScript', 'TypeScript']);

    const handleScan = () => {
        actions.findContributions(skills);
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Protocol Header */}
                <View className="mb-10 flex-row justify-between items-end">
                    <View>
                        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-[4px] mb-1">Module: OSS_RECON</Text>
                        <Text className="text-3xl font-bold text-white tracking-tighter">OS <Text className="text-primary italic">RECON</Text></Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleScan}
                        disabled={loading}
                        className="bg-white px-5 py-2 rounded-full flex-row items-center gap-2"
                    >
                        {loading ? <ActivityIndicator color="black" size="small" /> : (
                            <>
                                <Radar size={14} color="black" />
                                <Text className="text-black font-bold text-[10px] uppercase tracking-widest">Scan</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Target Status */}
                <View className="mb-8 p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl flex-row items-center justify-between">
                    <View>
                        <Text className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mb-1">Targeting Sensors</Text>
                        <Text className="text-white font-mono text-xs tracking-tight">{skills.join(' • ')}</Text>
                    </View>
                    <View className="w-1.5 h-1.5 bg-primary rounded-full" />
                </View>

                {/* Recon Results */}
                <View className="gap-3">
                    {issues.length > 0 ? (
                        issues.map((issue: any, i: number) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => Linking.openURL(issue.html_url)}
                                className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex-row items-center justify-between relative overflow-hidden"
                            >
                                <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary/10" />
                                <View className="flex-1 mr-4">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Github color="#71717a" size={12} />
                                        <Text className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest" numberOfLines={1}>
                                            {issue.repository_url?.split('/').pop()}
                                        </Text>
                                    </View>
                                    <Text className="text-white font-medium text-sm mb-3 tracking-tight" numberOfLines={2}>{issue.title}</Text>
                                    <View className="flex-row flex-wrap gap-1">
                                        {issue.labels.slice(0, 2).map((l: any) => (
                                            <Text key={typeof l === 'string' ? l : l.name} className="text-[8px] font-mono text-zinc-500 bg-black border border-zinc-800 px-2 py-0.5 rounded uppercase">
                                                {typeof l === 'string' ? l : l.name}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                                <ArrowUpRight color="#3B82F6" size={18} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        !loading && (
                            <View className="py-20 items-center justify-center border border-dashed border-zinc-800 rounded-3xl">
                                <Github color="#18181b" size={40} className="mb-4" />
                                <Text className="text-zinc-600 font-mono text-[10px] uppercase tracking-[2px]">Awaiting Scan Initiation...</Text>
                            </View>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
