const express = require('express');
const cors = require('cors');
const gtts = require('node-gtts')('en');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Express TTS Server is running on Vercel!');
});

// TTS route
app.post('/tts', (req, res) => {
  try {
    const { text, lang_code } = req.body;
    console.log(`--- Received POST request for TTS. Data:`, { text: text?.substring(0, 30) + '...', lang_code });

    if (!text || !lang_code) {
      console.error("--- Error: Missing 'text' or 'lang_code' in request body.");
      return res.status(400).send("Missing 'text' or 'lang_code' in request body");
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="tts_output.mp3"');

    console.log(`--- Generating TTS stream...`);
    const speech = gtts.stream(text);
    speech.pipe(res);

    speech.on('finish', () => {
      console.log("--- TTS generation complete. Stream sent.");
    });

    speech.on('error', (err) => {
      console.error("--- Error during TTS generation:", err);
      res.status(500).send('Error during TTS generation');
    });
  } catch (e) {
    console.error("--- A server error occurred:", e);
    res.status(500).send(`Internal Server Error: ${e.message}`);
  }
});

module.exports = app; // ✅ Important — no app.listen()
