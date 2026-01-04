import { useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { ProjectIdea, ContributionIssue, SuggestResponse, SuggestRequest } from "../types/api";

// Use machine IP for Android emulator (10.0.2.2) or local IP, fallback to hosted URL
let API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000";
if (!API_BASE.endsWith('/api/github')) {
    API_BASE = API_BASE.replace(/\/$/, '') + '/api/github';
}
console.log('[DEBUG] GIGAI API_BASE:', API_BASE);

export const useGIGAI = () => {
    const [loading, setLoading] = useState(false);
    const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
    const [roadmap, setRoadmap] = useState<string>("");
    const [issues, setIssues] = useState<ContributionIssue[]>([]);
    const [explanation, setExplanation] = useState<string>("");

    const suggestIdeas = async (payload: SuggestRequest) => {
        setLoading(true);
        const fullUrl = `${API_BASE}/suggest`;
        console.log('[API] Suggesting ideas. URL:', fullUrl);
        console.log('[API] Payload:', payload);
        try {
            const res = await axios.post(fullUrl, payload);
            if (res.data.success) {
                setIdeas(res.data.ideas);
            } else {
                Alert.alert('Generation Error', res.data.error || 'Failed to generate ideas.');
            }
        } catch (error: any) {
            console.error('[API] Suggest Error:', error.response?.data || error.message);
            Alert.alert('Connection Error', `Failed to reach core: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const generateRoadmap = async (topic: string) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/roadmap`, { topic });
            setRoadmap(res.data.roadmap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const explainer = async (url: string, context: string) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/explain`, { url, user_context: context });
            setExplanation(res.data.explanation);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const findContributions = async (languages: string[]) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/contribute`, { languages });
            setIssues(res.data.issues);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        ideas,
        roadmap,
        issues,
        explanation,
        actions: {
            suggestIdeas,
            generateRoadmap,
            explainer,
            findContributions
        }
    };
};
