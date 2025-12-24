const github = require('../lib/github');
const gemini = require('../lib/gemini');
const supabase = require('../config/supabase');

const suggestIdeas = async (req, res) => {
    try {
        const { user_id, languages, frameworks, experience_level } = req.body;

        if (!user_id || !languages || !frameworks || !experience_level) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Save user skills to Supabase
        const { error: skillError } = await supabase
            .from('user_skills')
            .upsert({ user_id, languages, frameworks, experience_level }, { onConflict: 'user_id' });

        if (skillError) console.error('Error saving skills:', skillError);

        // 2. Fetch GitHub trends
        const trends = await github.getTrendingTopics({ languages, frameworks });

        // 3. Generate ideas using Gemini
        const ideas = await gemini.generateProjectIdeas({ languages, frameworks, experience_level }, trends);

        if (!ideas) {
            return res.status(500).json({ error: 'Failed to generate ideas' });
        }

        // 4. Store ideas in Supabase
        const projectEntries = ideas.map(idea => ({
            user_id,
            idea: JSON.stringify(idea),
            difficulty: idea.difficulty || 'Medium',
            ai_generated: true
        }));

        const { error: projectError } = await supabase
            .from('project_ideas')
            .insert(projectEntries);

        if (projectError) console.error('Error saving projects:', projectError);

        res.json({ success: true, ideas });
    } catch (error) {
        console.error('Suggest error:', error);
        res.status(500).json({ error: error.message });
    }
};

const explainRepo = async (req, res) => {
    try {
        const { owner, repo } = req.body;

        if (!owner || !repo) {
            return res.status(400).json({ error: 'Owner and Repo are required' });
        }

        const { repo: repoDetails, readme } = await github.getRepoDetails(owner, repo);
        const explanation = await gemini.explainArchitecture(repoDetails, readme);

        res.json({ success: true, explanation });
    } catch (error) {
        console.error('Explain error:', error);
        res.status(500).json({ error: error.message });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        const roadmap = await gemini.generateRoadmap(topic);

        res.json({ success: true, roadmap });
    } catch (error) {
        console.error('Roadmap error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    suggestIdeas,
    explainRepo,
    getRoadmap
};
