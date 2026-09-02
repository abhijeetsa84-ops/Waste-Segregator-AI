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
  }
];

export const handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg' } = JSON.parse(event.body);

    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No image data provided' }) };
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const DEMO_MODE = !GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here';

    if (DEMO_MODE) {
      // Simulate latency
      await new Promise(r => setTimeout(r, 1500));
      return {
        statusCode: 200,
        body: JSON.stringify({ ...DEMO_RESPONSES[0], isDemo: true })
      };
    }

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

      for (let attempt = 1; attempt <= 2; attempt++) {
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
            lastError = data.error?.message || 'Unknown error';
            if (apiResponse.status === 429 || apiResponse.status === 503) {
              if (attempt < 2) {
                await new Promise(r => setTimeout(r, 2000));
                continue;
              }
            }
            break;
          }

          const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (!text) {
            lastError = 'AI returned an empty response';
            break;
          }

          const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
          const parsed = JSON.parse(cleaned);

          return {
            statusCode: 200,
            body: JSON.stringify({ ...parsed, isDemo: false })
          };

        } catch (fetchErr) {
          clearTimeout(timeout);
          lastError = fetchErr.name === 'AbortError' ? 'Request timed out' : fetchErr.message;
          break;
        }
      }
    }

    return {
      statusCode: 502,
      body: JSON.stringify({ error: `All AI models are currently busy. ${lastError || 'Please try again.'}` })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Classification failed: ${err.message}` })
    };
  }
};
