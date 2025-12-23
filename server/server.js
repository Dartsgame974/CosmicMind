import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import si from 'systeminformation';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Database Paths ---
const DATA_DIR = path.join(__dirname, 'data');
const CARDS_FILE = path.join(DATA_DIR, 'cards.json');
const LOCALES_DIR = path.join(__dirname, 'locales');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(CARDS_FILE)) fs.writeFileSync(CARDS_FILE, JSON.stringify([]));

// --- Cards API ---
app.get('/api/cards', (req, res) => {
    try {
        const data = fs.readFileSync(CARDS_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.json([]);
    }
});

app.post('/api/cards', (req, res) => {
    try {
        const newCard = req.body;
        const data = JSON.parse(fs.readFileSync(CARDS_FILE, 'utf-8'));

        // Auto-increment ID
        const maxId = data.reduce((max, c) => Math.max(max, c.id || 0), 0);
        const cardWithId = { ...newCard, id: maxId + 1 };

        data.push(cardWithId);
        fs.writeFileSync(CARDS_FILE, JSON.stringify(data, null, 2));

        res.json(cardWithId);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to save card" });
    }
});

app.delete('/api/cards/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let data = JSON.parse(fs.readFileSync(CARDS_FILE, 'utf-8'));
        data = data.filter(c => c.id !== id);
        fs.writeFileSync(CARDS_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete card" });
    }
});

// --- Locales API ---
app.get('/api/locales', (req, res) => {
    try {
        if (!fs.existsSync(LOCALES_DIR)) return res.json([]);
        const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'));
        const locales = files.map(f => ({
            id: f.replace('.json', ''),
            name: f.replace('.json', '').toUpperCase() // Simple name derived from code
        }));
        res.json(locales);
    } catch (e) {
        res.status(500).json({ error: "Failed to list locales" });
    }
});

app.get('/api/locales/:lang', (req, res) => {
    try {
        const lang = req.params.lang;
        const filePath = path.join(LOCALES_DIR, `${lang}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            res.json(JSON.parse(data));
        } else {
            res.status(404).json({ error: "Locale not found" });
        }
    } catch (e) {
        res.status(500).json({ error: "Failed to load locale" });
    }
});
app.get('/api/system', async (req, res) => {
    try {
        const [cpu, mem, load] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.currentLoad()
        ]);

        res.json({
            cpu: {
                manufacturer: cpu.manufacturer,
                brand: cpu.brand,
                cores: cpu.cores,
                speed: cpu.speed,
                load: Math.round(load.currentLoad)
            },
            memory: {
                total: mem.total,
                free: mem.free,
                used: mem.used,
                active: mem.active,
                available: mem.available
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch system stats" });
    }
});

// --- Ollama Models Endpoint ---
app.get('/api/models', async (req, res) => {
    try {
        // Proxy to local Ollama instance
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) throw new Error("Ollama not reachable");
        const data = await response.json();
        res.json(data.models || []);
    } catch (e) {
        console.error("Ollama Error:", e);
        // Return empty or mock if Ollama isn't running, to prevent frontend crash
        res.json([]);
    }
});

// --- Themes Endpoints ---
const THEMES_DIR = path.join(__dirname, 'themes');

app.get('/api/themes', (req, res) => {
    try {
        if (!fs.existsSync(THEMES_DIR)) {
            return res.json([]);
        }
        const files = fs.readdirSync(THEMES_DIR).filter(f => f.endsWith('.json'));
        const themes = files.map(file => {
            const content = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, file), 'utf-8'));
            return {
                id: file.replace('.json', ''),
                name: content.name,
                colors: content.colors
            };
        });
        res.json(themes);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to load themes" });
    }
});

// --- Metadata Endpoint ---
app.get('/api/metadata', async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const cleanUrl = url.trim();
        let source = "web";
        if (cleanUrl.match(/twitter\.com|x\.com/)) source = "twitter";
        else if (cleanUrl.match(/youtube\.com|youtu\.be/)) source = "youtube";
        else if (cleanUrl.match(/reddit\.com/)) source = "reddit";

        console.log(`Fetching metadata for: ${cleanUrl} (${source})`);

        if (source === "twitter") {
            const tweetId = cleanUrl.match(/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/)?.[1];
            if (tweetId) {
                const apiUrl = `https://api.fxtwitter.com/status/${tweetId}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.code === 200 && data.tweet) {
                    const tweet = data.tweet;
                    const images = tweet.media?.photos?.map(p => p.url) || [];
                    return res.json({
                        title: `${tweet.author.name} on X`,
                        description: tweet.text,
                        thumbnail: images[0] || tweet.author.avatar_url,
                        images: images,
                        source: "twitter"
                    });
                }
            }
        }

        if (source === "youtube") {
            const videoId = cleanUrl.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1];
            const apiKey = req.query.key;

            // Try Google YouTube API if key provided
            if (apiKey && videoId) {
                try {
                    console.log(`Using YouTube API for video: ${videoId}`);
                    const ytRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
                    const ytData = await ytRes.json();

                    if (ytData.items && ytData.items.length > 0) {
                        const snippet = ytData.items[0].snippet;
                        const bestImage = snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url;

                        return res.json({
                            title: snippet.title,
                            description: snippet.description,
                            thumbnail: bestImage,
                            images: [bestImage],
                            source: "youtube",
                            tags: snippet.tags || []
                        });
                    }
                } catch (e) {
                    console.error("YouTube API request failed, falling back to noembed", e);
                }
            }

            // Fallback (NoEmbed)
            const response = await fetch(`https://noembed.com/embed?url=${cleanUrl}`);
            const data = await response.json();
            if (data.title) {
                let thumb = data.thumbnail_url;
                if (videoId) thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                return res.json({
                    title: data.title,
                    description: data.author_name,
                    thumbnail: thumb,
                    images: [thumb],
                    source: "youtube"
                });
            }
        }

        // Generic Web Scraping (Cheerio)
        const response = await fetch(cleanUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const html = await response.text();
        const $ = cheerio.load(html);

        const getMeta = (name) => {
            return $(`meta[property="${name}"]`).attr('content') ||
                $(`meta[name="${name}"]`).attr('content') || '';
        };

        const title = getMeta('og:title') || $('title').text() || cleanUrl;
        const description = getMeta('og:description') || getMeta('description') || "No description available";
        const image = getMeta('og:image') || getMeta('twitter:image');

        // Extract Keywords/Tags
        let extractedTags = [];
        const keywords = getMeta('keywords');
        if (keywords) {
            extractedTags = keywords.split(',').map(k => k.trim());
        }
        $('meta[property="article:tag"]').each((i, el) => {
            const tag = $(el).attr('content');
            if (tag) extractedTags.push(tag);
        });

        extractedTags = [...new Set(extractedTags)];

        // Handle relative URLs for images
        let absoluteImage = image;
        if (image && !image.startsWith('http')) {
            try {
                absoluteImage = new URL(image, cleanUrl).href;
            } catch (e) { }
        }

        return res.json({
            title: title,
            description: description,
            thumbnail: absoluteImage || "",
            images: absoluteImage ? [absoluteImage] : [],
            source: "web",
            tags: extractedTags
        });

    } catch (error) {
        console.error("Server Fetch Error:", error);
        return res.status(500).json({ error: "Failed to fetch metadata" });
    }
});

app.listen(PORT, () => {
    console.log(`CosmicMind Backend running on http://localhost:${PORT}`);
});
