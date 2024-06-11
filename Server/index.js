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
        const summary = await herc.question({ content: 'summarize this YT vid for notetaking keep it long' + transcript });
        // Send the summary back to the client
        res.json({ summary: summary.reply });
    } catch (error) {
        console.error('Error summarizing transcript:', error);
        res.status(500).json({ error: 'Error summarizing transcript' });
    }
});

// Endpoint to download YouTube video
app.get('/download', async (req, res) => {
    try {
        const URL = req.query.URL;
        if (!URL) {
            return res.status(400).send('No URL provided');
        }

        // Get video info
        const info = await ytdl.getInfo(URL);

        // Find the format with the highest quality
        const format = info.formats.find(format => format.hasVideo && format.hasAudio);

        if (!format) {
            return res.status(500).send('No video format found');
        }

        // Download the video
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        const videoStream = ytdl(URL, { format: format });

        videoStream.pipe(res);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


// Endpoint to download MP3 from YouTube video
app.get('/downloadmp3', async (req, res) => {
    try {
        const URL = req.query.URL;
        if (!URL) {
            return res.status(400).send('No URL provided');
        }
        // Download the audio from the YouTube video
        res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
        await ytdl(URL, {
            format: 'mp3',
            filter: 'audioonly',
            quality: 'highestaudio'
        }).pipe(res);
    } catch (error) {
        console.error('Error downloading MP3:', error);
        res.status(500).json({ error: 'Error downloading MP3' });
    }
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
