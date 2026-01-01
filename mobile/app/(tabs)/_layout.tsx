import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Lightbulb, Code2, BookOpen, Github } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#000000',
                    borderTopColor: '#18181b',
                    height: 85,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#3f3f46',
                tabBarLabelStyle: {
                    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
                    fontSize: 9,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ideas',
                    tabBarIcon: ({ color }) => <Lightbulb size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explain"
                options={{
                    title: 'Decrypt',
                    tabBarIcon: ({ color }) => <Code2 size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="roadmap"
                options={{
                    title: 'Roadmap',
                    tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="contribute"
                options={{
                    title: 'OS Recon',
                    tabBarIcon: ({ color }) => <Github size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
