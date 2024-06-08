// Server-side Node.js with Express
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const { Hercai } = require('hercai');
const app = express();
app.use(cors());

// Set environment variable to prevent ytdl from updating
process.env.YTDL_NO_UPDATE = 'true';

// Initialize Hercai instance
const herc = new Hercai();

// Middleware to parse JSON body
app.use(express.json());

// Endpoint to handle transcript summarization request
app.post('/summarize', async (req, res) => {
    try {
        // Get transcript from request body
        const { transcript } = req.body;
        // Summarize the transcript using Hercai
        const summary = await herc.question({ content: 'summarize this YouTube video for notetaking:' + transcript });
        // Send the summary back to the client
        res.json({ summary: summary.reply });
    } catch (error) {
        console.error('Error summarizing transcript:', error);
        res.status(500).json({ error: 'Error summarizing transcript' });
    }
});

// Endpoint to download YouTube video
app.get('/download', (req, res) => {
    var URL = req.query.URL;
    if (!URL) {
        return res.status(400).send('No URL provided');
    }
    // Download the YouTube video
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(URL, {
        format: 'mp4',
        filter: 'audioandvideo',
        quality: 'highest'
    }).pipe(res);
});

app.post('/prompt', async (req, res) => {
    try {
        // Get prompt from request body
        const { prompt } = req.body;
        // Generate a response using Hercai
        const reply = await herc.question({ content: prompt });
        // Send the reply back to the client
        res.json({ reply: reply.reply });
    } catch (error) {
        console.error('Error processing AI prompt:', error);
        res.status(500).json({ error: 'Error processing AI prompt' });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
