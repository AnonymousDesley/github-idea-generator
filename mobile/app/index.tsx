import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator, Dimensions, useWindowDimensions, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useGIGAI } from '../hooks/useGIGAI';
import { Lightbulb, Code2, BookOpen, Github, ArrowRight, Menu, X, LogOut, Activity } from 'lucide-react-native';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import TagInput from '../components/TagInput';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Helper for typewriter effect
const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (text) {
            const startTimeout = setTimeout(() => {
                let i = 0;
                timer = setInterval(() => {
                    setDisplayedText(text.substring(0, i + 1));
                    i++;
                    if (i === text.length) clearInterval(timer);
                }, 10);
            }, delay);
            return () => { clearTimeout(startTimeout); clearInterval(timer); };
        }
    }, [text, delay]);
    return <Text style={{ color: '#D4D4D8' }}>{displayedText}</Text>;
};

export default function Dashboard() {
    const { loading, ideas, roadmap, issues, explanation, actions } = useGIGAI();
    const [activeTab, setActiveTab] = useState<'ideas' | 'roadmap' | 'contribute' | 'explain'>('ideas');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<any>(null);
    const [loggingOut, setLoggingOut] = useState(false);

    const insets = useSafeAreaInsets();
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth > 768;

    // User State from Web Client
    const [userState, setUserState] = useState({
        id: '',
        username: '',
        skills: [] as string[],
        frameworks: [] as string[],
        level: 'Intermediate',
        interests: ''
    });

    const [repoUrl, setRepoUrl] = useState('');
    const [roadmapTopic, setRoadmapTopic] = useState('');
    const router = useRouter();

    // Check Auth
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.replace('/auth/login');
            else setUserState(prev => ({
                ...prev,
                id: session.user.id,
                username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Engineer'
            }));
        });
    }, []);

    const handleTabChange = (tab: typeof activeTab) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab);
    };

    const handleSidebarToggle = (isOpen: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSidebarOpen(isOpen);
    };

    const handleSignOut = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setLoggingOut(true);
        await supabase.auth.signOut();
        router.replace('/auth/login');
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="px-6 py-4 border-b border-zinc-800 flex-row justify-between items-center bg-transparent z-50">
                <TouchableOpacity onPress={() => handleSidebarToggle(true)}>
                    <Menu size={20} color="#A1A1AA" />
                </TouchableOpacity>

                <View className="flex-row items-center gap-2">
                    <Text className="text-zinc-500 font-mono text-[10px] tracking-widest hidden sm:flex">GIGAI_COMMAND_CENTER</Text>
                    <View className="px-1.5 py-0.5 bg-primary/20 border border-primary/20 rounded">
                        <Text className="text-primary text-[8px] font-bold">BETA</Text>
                    </View>
                </View>

                <View className="w-5" />
            </View>

            {/* Main Stage */}
            <ScrollView
                className="flex-1 px-4 sm:px-6"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-10 pt-4">
                    <Text className="text-3xl font-bold text-white tracking-tight mb-2">
                        <Text className="text-zinc-500 font-normal">Welcome back, </Text>
                        {userState.username || 'Engineer'}
                    </Text>

                    {/* Tab Switcher */}
                    <View className="mt-8">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 20,
                                paddingTop: 10,
                                paddingRight: 20,
                                paddingLeft: 4
                            }}
                            style={{ overflow: 'visible' }}
                        >
                            {[
                                { id: 'ideas', label: 'Idea Generator', icon: Lightbulb },
                                { id: 'explain', label: 'Decrypt Repo', icon: Code2 },
                                { id: 'roadmap', label: 'Learning Path', icon: BookOpen },
                                { id: 'contribute', label: 'Open Source', icon: Github },
                            ].map(tab => (
                                <TouchableOpacity
                                    key={tab.id}
                                    onPress={() => handleTabChange(tab.id as any)}
                                    className={`flex-row items-center gap-2 px-5 py-3 rounded-full mr-3 border ${activeTab === tab.id
                                        ? 'bg-zinc-900 border-primary shadow-lg shadow-primary/30'
                                        : 'border-zinc-600 bg-black/50'
                                        }`}
                                >
                                    <tab.icon size={16} color={activeTab === tab.id ? '#fff' : '#A1A1AA'} />
                                    <Text className={`text-xs font-bold ${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View className="h-[1px] bg-zinc-800 w-full -mt-[1px]" />
                    </View>
                </View>

                {/* Content View Switching */}
                {activeTab === 'ideas' && (
                    <View className="space-y-6">
                        {/* Core Stack Section */}
                        <View className="space-y-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <Code2 size={16} color="#A1A1AA" />
                                <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Core Stack</Text>
                            </View>

                            <TagInput
                                label="Languages"
                                placeholder="e.g. TypeScript, Python"
                                tags={userState.skills}
                                onChange={tags => setUserState({ ...userState, skills: tags })}
                                suggestions={[
                                    'JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'Ruby', 'Swift',
                                    'Kotlin', 'PHP', 'C#', 'SQL', 'Dart', 'Shell', 'R', 'Scala'
                                ]}
                            />

                            <TagInput
                                label="Frameworks"
                                placeholder="e.g. React, Django"
                                tags={userState.frameworks}
                                onChange={tags => setUserState({ ...userState, frameworks: tags })}
                                suggestions={[
                                    'React', 'Next.js', 'Vue', 'Svelte', 'Django', 'Flask', 'Express', 'Spring Boot',
                                    'Flutter', 'React Native', 'Laravel', 'FastAPI', 'Node.js', 'Angular', 'TailwindCSS'
                                ]}
                            />
                        </View>

                        {/* Clearance Level Section */}
                        <View className="space-y-4">
                            <View className="flex-row items-center gap-2 mb-2">
                                <Activity size={16} color="#A1A1AA" />
                                <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Clearance Level</Text>
                            </View>
                            <View className="flex-row gap-2">
                                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                                    <TouchableOpacity
                                        key={lvl}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setUserState({ ...userState, level: lvl });
                                        }}
                                        className={`flex-1 py-3 rounded-xl border items-center justify-center ${userState.level === lvl
                                            ? 'bg-zinc-900 border-primary shadow-lg shadow-primary/30'
                                            : 'border-zinc-800 bg-black/50'
                                            }`}
                                    >
                                        <Text className={`text-[10px] font-bold ${userState.level === lvl ? 'text-white' : 'text-zinc-500'}`}>
                                            {lvl.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View>
                            <TextInput
                                value={userState.interests}
                                onChangeText={text => setUserState({ ...userState, interests: text })}
                                placeholder="Target Protocol (e.g. AI Agents...)"
                                placeholderTextColor="#3f3f46"
                                className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl text-white font-mono text-sm focus:border-primary mb-4"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('[DEBUG] Generate pressed. Payload:', {
                                        user_id: userState.id,
                                        languages: userState.skills,
                                        frameworks: userState.frameworks,
                                        experience_level: userState.level,
                                        interests: userState.interests
                                    });
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    actions.suggestIdeas({
                                        user_id: userState.id,
                                        languages: userState.skills,
                                        frameworks: userState.frameworks,
                                        experience_level: userState.level,
                                        interests: userState.interests
                                    });
                                }}
                                disabled={loading}
                                className="bg-white py-4 rounded-xl flex-row items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {loading ? <ActivityIndicator size="small" color="black" /> : (
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-black font-bold text-sm tracking-wide">GENERATE</Text>
                                        <ArrowRight color="black" size={16} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Bento Grid */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                            {ideas.map((idea, i) => (
                                <ProjectCard
                                    key={i}
                                    idea={idea}
                                    index={i}
                                    onPress={() => {
                                        Haptics.selectionAsync();
                                        setSelectedIdea(idea);
                                    }}
                                    style={{ width: isTablet ? '48%' : '100%' }}
                                />
                            ))}
                        </View>

                        {ideas.length === 0 && !loading && (
                            <View className="h-40 items-center justify-center border border-dashed border-zinc-800 rounded-xl">
                                <Text className="text-zinc-600 font-mono text-xs">AWAITING TARGET INPUT...</Text>
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'explain' && (
                    <View className="space-y-6">
                        <View className="flex-row gap-3">
                            <TextInput
                                value={repoUrl}
                                onChangeText={setRepoUrl}
                                className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg font-mono text-sm text-white focus:border-primary"
                                placeholder="https://github.com/..."
                                placeholderTextColor="#3f3f46"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    actions.explainer(repoUrl, userState.level);
                                }}
                                disabled={loading}
                                className="bg-primary px-6 rounded-lg justify-center items-center"
                            >
                                <Text className="text-white font-bold text-xs">ANALYZE</Text>
                            </TouchableOpacity>
                        </View>
                        {explanation && (
                            <View className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                                <Typewriter text={explanation} />
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'roadmap' && (
                    <View className="space-y-6">
                        <View className="flex-row gap-3">
                            <TextInput
                                value={roadmapTopic}
                                onChangeText={setRoadmapTopic}
                                className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg font-mono text-sm text-white focus:border-primary"
                                placeholder="Skill Target..."
                                placeholderTextColor="#3f3f46"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    actions.generateRoadmap(roadmapTopic);
                                }}
                                disabled={loading}
                                className="bg-primary px-6 rounded-lg justify-center items-center"
                            >
                                <Text className="text-white font-bold text-xs">INITIATE</Text>
                            </TouchableOpacity>
                        </View>
                        {roadmap && (
                            <View className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
                                <View className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                <Typewriter text={roadmap} />
                            </View>
                        )}
                    </View>
                )}

                {activeTab === 'contribute' && (
                    <View className="space-y-6">
                        <View className="flex-row justify-between items-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                            <View>
                                <Text className="text-lg font-bold text-white mb-1">Open Source Recon</Text>
                                <Text className="text-xs text-zinc-500">Targeting: {userState.skills.join(', ') || 'Global'}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    actions.findContributions(userState.skills);
                                }}
                                disabled={loading}
                                className="bg-white px-5 py-2 rounded-lg"
                            >
                                <Text className="text-black font-bold text-xs">SCAN</Text>
                            </TouchableOpacity>
                        </View>

                        {issues.map((issue, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => Haptics.selectionAsync()}
                                className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg flex-row justify-between items-center"
                            >
                                <View className="flex-1 pr-4">
                                    <Text className="text-white font-medium text-sm mb-2">{issue.title}</Text>
                                    <View className="flex-row gap-2 flex-wrap">
                                        {issue.labels.map(l => (
                                            <Text key={l} className="text-[9px] bg-black border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500 uppercase">{l}</Text>
                                        ))}
                                    </View>
                                </View>
                                <Text className="text-primary font-mono text-xs">ACCESS {'>'}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            <ProjectModal idea={selectedIdea} onClose={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedIdea(null);
            }} />

            {/* Sidebar Modal (Mobile Overlay Logic) */}
            <Modal visible={sidebarOpen} animationType="slide" transparent>
                <View className="flex-1 bg-black/90 z-[1000]">
                    <View style={{ paddingTop: insets.top, flex: 1 }}>
                        <View className="flex-1 bg-black border-r border-zinc-800 w-[85%] h-full shadow-2xl">
                            <View className="p-6 border-b border-zinc-800 flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                                        <View className="w-2 h-2 bg-black rounded-full" />
                                    </View>
                                    <Text className="font-mono text-xs tracking-widest text-zinc-400">GIGAI</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleSidebarToggle(false)}>
                                    <X size={20} color="#A1A1AA" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView className="p-6 space-y-8">
                                <View className="space-y-1">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <Text className="text-[10px] uppercase tracking-widest text-zinc-400 font-mono">User Identity</Text>
                                    </View>
                                    <View className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                                        <Text className="text-white font-bold">{userState.username || 'Engineer'}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    className="flex-row items-center justify-between py-4 border-b border-zinc-900"
                                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <BookOpen size={18} color="#71717a" />
                                        <Text className="text-zinc-400 font-mono text-xs tracking-widest">PROJECTS HISTORY</Text>
                                    </View>
                                    <View className="bg-zinc-800 px-2 py-0.5 rounded">
                                        <Text className="text-[8px] text-zinc-500 font-bold">SOON</Text>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>

                            <View className="p-4 border-t border-zinc-800">
                                <TouchableOpacity
                                    onPress={handleSignOut}
                                    className="flex-row items-center gap-3 mb-4"
                                    disabled={loggingOut}
                                >
                                    <LogOut size={16} color="#ef4444" />
                                    <Text className="text-red-500 font-mono text-xs tracking-widest">
                                        {loggingOut ? 'TERMINATING_SESSION...' : 'LOGOUT'}
                                    </Text>
                                </TouchableOpacity>

                                <View className="flex-row justify-between items-center">
                                    <Text className="text-[10px] text-zinc-500 font-mono">SYSTEM: ONLINE</Text>
                                    <Text className="text-green-500 text-xs">●</Text>
                                </View>
                            </View>
                        </View>

                        {/* Tap outside to close */}
                        <TouchableOpacity className="absolute right-0 top-0 bottom-0 w-[15%]" onPress={() => handleSidebarToggle(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}
