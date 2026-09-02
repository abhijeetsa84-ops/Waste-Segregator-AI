# AI Waste Segregator 🗑️♻️

An AI-powered web app that classifies waste items from photos using **Google Gemini Vision API** and provides instant disposal guidance.

## Features

- 📸 **Upload or capture** photos via drag-and-drop or camera
- 🤖 **AI classification** into 6 waste categories
- 🎨 **Colour-coded results** with disposal instructions & eco tips
- 📋 **Session history** panel (stored in browser localStorage)
- 🎭 **Demo mode** — works without an API key (shows realistic mock responses)

## Waste Categories

| Category | Bin | Examples |
|---|---|---|
| 🥦 Organic | Green | Food scraps, peels, garden waste |
| ♻️ Recyclable | Blue | Paper, plastic, glass, metal |
| ⚠️ Hazardous | Red | Batteries, chemicals, medicine |
| 💻 E-Waste | E-Waste Centre | Phones, computers, cables |
| 🩺 Sanitary | Yellow | Masks, diapers, bandages |
| 🪨 Residual | Grey | Ceramics, rubble, mixed waste |

## Setup & Running

### 1. Clone / open the project
```
cd "d:\Ai- Waste segregator"
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure API key (optional — demo mode works without it)
```bash
# In the server/ directory, create a .env file:
GEMINI_API_KEY=your_key_here
PORT=3001
```
Get a free key at [https://aistudio.google.com/](https://aistudio.google.com/)

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Icons | Lucide React |
| Backend | Node.js, Express |
| AI | Google Gemini 1.5 Flash (Vision) |
