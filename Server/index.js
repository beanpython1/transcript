process.env.YTDL_NO_UPDATE = 'true';
// Server-side Node.js with Express
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
app.use(cors());

app.get('/download', (req, res) => {
    var URL = req.query.URL;
    if (!URL) {
        return res.status(400).send('No URL provided');
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(URL, {
        format: 'mp4',
        filter: 'audioandvideo',
        quality: 'highest'
    }).pipe(res);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
