import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Always resolve .env relative to this file's directory
const result = dotenv.config({ path: resolve(__dirname, '.env') });
if (result.error) {
  console.warn('⚠️  Could not load .env file:', result.error.message);
}

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '20mb' }));

// ── Gemini Setup ──────────────────────────────────────────────────────────────
const DEMO_MODE = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ── Classification Prompt ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert waste classification AI. Analyze the image provided and classify the waste item into exactly one of these six categories:

1. ORGANIC - Wet/biodegradable: food scraps, vegetable/fruit peels, garden waste, leftovers, tea/coffee waste
2. RECYCLABLE - Dry recyclables: paper, cardboard, plastic bottles/containers, glass bottles/jars, metal cans, tin foil
3. HAZARDOUS - Dangerous waste: batteries, paints, solvents, chemicals, expired medicines, fluorescent bulbs, motor oil
4. E-WASTE - Electronic waste: phones, computers, TVs, cables, chargers, circuit boards, electronic accessories
5. SANITARY - Bio-medical/sanitary: used masks, diapers, sanitary pads, used bandages, cotton swabs, medical gloves
6. RESIDUAL - General/inert non-recyclable: ceramics, broken crockery, construction rubble, mixed waste, styrofoam, contaminated items

Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{
  "category": "ORGANIC" | "RECYCLABLE" | "HAZARDOUS" | "E-WASTE" | "SANITARY" | "RESIDUAL",
  "itemName": "brief name of the detected item",
  "confidence": 0.0 to 1.0,
  "reason": "one sentence explaining why this category was chosen",
  "advice": "specific disposal advice for this item",
  "tips": ["tip 1", "tip 2", "tip 3"]
}`;

// ── Demo responses for when no API key is provided ────────────────────────────
const DEMO_RESPONSES = [
  {
    category: 'RECYCLABLE',
    itemName: 'Plastic Bottle',
    confidence: 0.94,
    reason: 'This appears to be a plastic bottle, which is a recyclable dry waste item.',
    advice: 'Rinse the bottle, remove the cap and label if possible, then place in the blue recycling bin.',
    tips: [
      'Crush the bottle to save space in the recycling bin',
      'Caps can often be recycled separately — check local guidelines',
      'Remove any liquid before recycling to avoid contamination'
    ]
  },
  {
    category: 'ORGANIC',
    itemName: 'Food Waste',
    confidence: 0.91,
    reason: 'Biodegradable food material detected, suitable for composting or wet waste bin.',
    advice: 'Place in the green/wet waste bin. Consider home composting to create nutrient-rich compost.',
    tips: [
      'Collect in a small bin lined with newspaper to absorb moisture',
      'Composting organic waste reduces landfill by up to 30%',
      'Avoid mixing with plastics or other dry waste'
    ]
  },
  {
    category: 'HAZARDOUS',
    itemName: 'Battery',
    confidence: 0.97,
    reason: 'Batteries contain toxic chemicals and heavy metals requiring special disposal.',
    advice: 'Never throw in regular bins. Take to a designated battery collection point or e-waste facility.',
    tips: [
      'Many electronics stores have battery take-back programs',
      'Tape the terminals before disposal to prevent short-circuits',
      'Consider switching to rechargeable batteries to reduce waste'
    ]
  },
  {
    category: 'E-WASTE',
    itemName: 'Electronic Device',
    confidence: 0.89,
    reason: 'Electronic equipment containing circuit boards and potentially toxic components.',
    advice: 'Take to an authorized e-waste collection center. Do not discard in regular trash.',
    tips: [
      'Wipe personal data before disposing of phones/computers',
      'Some manufacturers offer take-back programs',
      'Refurbished electronics can get a second life — consider donating if functional'
    ]
  }
];

// ── POST /api/classify ────────────────────────────────────────────────────────
app.post('/api/classify', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Demo mode — return randomized mock response
    if (DEMO_MODE) {
      console.log('⚠️  Running in DEMO MODE (no Gemini API key). Add GEMINI_API_KEY to server/.env for real AI.');
      await new Promise(r => setTimeout(r, 1800)); // simulate latency
      const demo = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
      return res.json({ ...demo, isDemo: true });
    }

    // Real Gemini Vision call via REST API — with fallback models and retry
    const MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

    const requestBody = {
      contents: [{
        parts: [
          { text: SYSTEM_PROMPT },
          { inlineData: { mimeType, data: imageBase64 } }
        ]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024
      }
    };

    let lastError = null;

    for (const model of MODELS) {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      // Retry up to 2 times per model on rate-limit errors
      for (let attempt = 1; attempt <= 2; attempt++) {
        console.log(`📤 Trying model: ${model} (attempt ${attempt})...`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        try {
          const apiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
          });
          clearTimeout(timeout);

          const data = await apiResponse.json();

          if (!apiResponse.ok) {
            const errMsg = data.error?.message || 'Unknown error';
            console.warn(`⚠️  ${model} error (${data.error?.code}): ${errMsg}`);
            lastError = errMsg;

            // If rate-limited (429/503), wait and retry
            if (apiResponse.status === 429 || apiResponse.status === 503) {
              if (attempt < 2) {
                console.log(`⏳ Rate limited, waiting 2s before retry...`);
                await new Promise(r => setTimeout(r, 2000));
                continue;
              }
            }
            // Try next model
            break;
          }

          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (!text) {
            console.warn(`⚠️  ${model} returned empty text, trying next model...`);
            lastError = 'AI returned an empty response';
            break;
          }

          console.log('📥 Gemini raw response:', text.slice(0, 200));

          // Strip markdown code fences if present
          const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
          const parsed = JSON.parse(cleaned);

          console.log(`✅ Classified as: ${parsed.category} (${Math.round((parsed.confidence || 0) * 100)}%) [model: ${model}]`);
          return res.json({ ...parsed, isDemo: false });

        } catch (fetchErr) {
          clearTimeout(timeout);
          if (fetchErr.name === 'AbortError') {
            console.warn(`⏰ ${model} timed out after 25s`);
            lastError = 'Request timed out';
            break; // try next model
          }
          console.warn(`❌ ${model} fetch error:`, fetchErr.message);
          lastError = fetchErr.message;
          break; // try next model
        }
      }
    }

    // All models failed
    return res.status(502).json({
      error: `All AI models are currently busy. ${lastError || 'Please try again in a moment.'}`
    });

  } catch (err) {
    console.error('Classification error:', err.message || err);
    return res.status(500).json({ error: `Classification failed: ${err.message || 'Unknown error'}` });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', demoMode: DEMO_MODE });
});

app.listen(PORT, () => {
  const key = process.env.GEMINI_API_KEY || '';
  const keyPreview = key && key !== 'your_gemini_api_key_here'
    ? `${key.slice(0, 8)}...` : 'NOT SET / placeholder';

  console.log(`\n🚀 AI Waste Segregator API running on http://localhost:${PORT}`);
  console.log(`🔑 GEMINI_API_KEY read as: ${keyPreview}`);
  if (DEMO_MODE) {
    console.log('⚠️  DEMO MODE — real key not detected. Edit server/.env then restart.\n');
  } else {
    console.log('✅ Gemini API key detected — real AI classification enabled\n');
  }
});
