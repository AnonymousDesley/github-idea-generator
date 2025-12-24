const axios = require('axios');

const getTrendingTopics = async ({ languages }) => {
    try {
        const langQuery = languages && languages.length > 0 ? `language:${languages[0]}` : 'stars:>15000';
        const response = await axios.get(`https://api.github.com/search/repositories?q=${langQuery}&sort=stars`, {
            headers: { 'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '' }
        });
        return response.data.items.slice(0, 5).map(repo => `${repo.name}: ${repo.description}`).join(' | ');
    } catch (error) {
        return "Microservices, AI Agents, and Scalable Backend Architectures";
    }
};

const getRepoDetails = async (owner, repo) => {
    const headers = { 'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : '' };
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    let readme = "";
    try {
        const readmeRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
        readme = Buffer.from(readmeRes.data.content, 'base64').toString();
    } catch (e) { readme = "README not found"; }
    return { repo: repoRes.data, readme };
};

module.exports = { getTrendingTopics, getRepoDetails };