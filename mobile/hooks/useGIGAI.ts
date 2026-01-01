import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../constants/Config';

export interface ProjectIdea {
    title: string;
    description: string;
    tech_stack: string[] | any;
    difficulty: string;
    estimated_time: string;
}

export const useGIGAI = () => {
    const [loading, setLoading] = useState(false);
    const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
    const [roadmap, setRoadmap] = useState<string | null>(null);
    const [issues, setIssues] = useState<any[]>([]);
    const [explanation, setExplanation] = useState<string | null>(null);

    const suggestIdeas = useCallback(async (userData: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/github/suggest`, userData);
            setIdeas(response.data.ideas);
        } catch (error) {
            console.error('Suggest Ideas Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const generateRoadmap = useCallback(async (topic: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/github/roadmap`, { topic });
            setRoadmap(response.data.roadmap);
        } catch (error) {
            console.error('Roadmap Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const findContributions = useCallback(async (languages: string[]) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/github/contribute`, { languages });
            setIssues(response.data.issues);
        } catch (error) {
            console.error('Contributions Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const explainer = useCallback(async (url: string, user_id?: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/github/explain`, { url, user_id });
            setExplanation(response.data.explanation);
        } catch (error) {
            console.error('Explainer Error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const elaborateProject = useCallback(async (project: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/github/elaborate`, project);
            return response.data.spec;
        } catch (error) {
            console.error('Elaborate Error:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        ideas,
        roadmap,
        issues,
        explanation,
        actions: {
            suggestIdeas,
            generateRoadmap,
            findContributions,
            explainer,
            elaborateProject
        }
    };
};
