require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubRoutes = require('./routes/github');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware for logging
app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/github', githubRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
