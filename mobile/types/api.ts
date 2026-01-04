export interface ProjectIdea {
    title: string;
    description: string;
    tech_stack: string | string[];
    estimated_time: string;
    difficulty: string;
}

export interface SuggestResponse {
    success: boolean;
    ideas: ProjectIdea[];
    error?: string;
}

export interface SuggestRequest {
    user_id: string;
    languages: string[];
    frameworks: string[];
    experience_level: string;
    interests?: string;
}

export interface ContributionIssue {
    title: string;
    html_url: string;
    repository_url: string;
    number: number;
    labels: string[];
}

export interface RoadmapResponse {
    success: boolean;
    roadmap: string;
}

export interface ExplainResponse {
    success: boolean;
    explanation: string;
}
