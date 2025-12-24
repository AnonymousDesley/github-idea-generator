const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

// Route for generating project suggestions
router.post('/suggest', githubController.suggestIdeas);

// Route for explaining repo architecture
router.post('/explain', githubController.explainRepo);

// Route for generating learning roadmaps
router.post('/roadmap', githubController.getRoadmap);

module.exports = router;
