const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
    const query = String(req.query.q || "").trim();

    if (!query) {
        return res.json({
            success: true,
            count: 0,
            results: []
        });
    }

    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 12,
                    videoEmbeddable: "true",
                    key: process.env.YOUTUBE_API_KEY
                }
            }
        );

        const results = response.data.items.map((item) => ({
            id: item.id.videoId,
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            category: "YouTube",
            image: item.snippet.thumbnails.medium.url
        }));

        res.json({
            success: true,
            count: results.length,
            results: results
        });

    } catch (error) {
        console.error(
            "YouTube Search Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            success: false,
            message: "YouTube search failed."
        });
    }
});

module.exports = router;