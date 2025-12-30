const axios = require('axios');
require('dotenv').config();

const GITHUB_API_BASE = 'https://api.github.com';

const githubClient = axios.create({
    baseURL: GITHUB_API_BASE,
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

async function getTrendingTopics(skills) {
    try {
        let query = skills.languages.join('+') + '+' + skills.frameworks.join('+');
        if (skills.interests) {
            query += '+' + skills.interests.replace(/\s+/g, '+');
        }
        const response = await githubClient.get(`/search/repositories`, {
            params: {
                q: query,
                sort: 'stars',
                order: 'desc',
                per_page: 5
            }
        });

        return response.data.items.map(repo => ({
            name: repo.full_name,
            description: repo.description,
            topics: repo.topics,
            stars: repo.stargazers_count
        }));
    } catch (error) {
        console.error('Error fetching GitHub trends:', error.message);
        return [];
    }
}

async function getRepoDetails(owner, repo) {
    try {
        const [repoRes, readmeRes] = await Promise.all([
            githubClient.get(`/repos/${owner}/${repo}`),
            githubClient.get(`/repos/${owner}/${repo}/readme`)
        ]);

        let readmeContent = '';
        if (readmeRes.data && readmeRes.data.content) {
            readmeContent = Buffer.from(readmeRes.data.content, 'base64').toString('utf-8');
        }

        return {
            repo: repoRes.data,
            readme: readmeContent
        };
    } catch (error) {
        console.error('Error fetching repo details:', error.message);
        throw error;
    }
}

async function findGoodFirstIssues(skills) {
    try {
        // Construct query: label:good-first-issue + language:javascript ...
        const languageQuery = skills.languages.map(l => `language:${l}`).join(' ');
        const query = `label:"good first issue" state:open ${languageQuery}`;

        const response = await githubClient.get(`/search/issues`, {
            params: {
                q: query,
                sort: 'updated',
                order: 'desc',
                per_page: 5
            }
        });

        return response.data.items.map(issue => ({
            title: issue.title,
            html_url: issue.html_url,
            repository_url: issue.repository_url,
            number: issue.number,
            labels: issue.labels.map(l => l.name)
        }));
    } catch (error) {
        console.error('Error fetching issues:', error.message);
        return [];
    }
}

module.exports = {
    getTrendingTopics,
    getRepoDetails,
    findGoodFirstIssues
};