import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Groq SDK Lazy Init
  let groqClient: Groq | null = null;
  function getGroq() {
    if (!groqClient) {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('GROQ_API_KEY is missing');
      }
      groqClient = new Groq({ apiKey });
    }
    return groqClient;
  }

  // API Routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, vehicleInfo, pickup, dropoff, initialFare } = req.body;
      const groq = getGroq();

      const baseFare = Number(initialFare) || 150;
      const demandFare = baseFare + 80;

      const systemPrompt = `You are a local Bangladeshi ride-sharing driver of a ${vehicleInfo.type}. The user wants to go from ${pickup} to ${dropoff}. The base fare shown in the app is ${baseFare} BDT, but you demand at least ${demandFare} BDT because of heavy traffic in Dhaka.
Respond naturally in a mix of Bangla, English, and Banglish (e.g., 'Bhai, ekhon onek jam. Varatato ektu baraya dite hobe.').
Rules:
1. NEVER accept the first price. Create intentional friction.
2. If the user argues logically or politely, decrease your price slightly.
3. If the user is rude, stay stubborn.
4. Once you agree on a price, output ONLY: 'DEAL_DONE: [amount]'. Return no other text in that specific response.
5. Keep responses short and conversational, like a real driver in a hurry.`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        model: 'llama-3.1-8b-instant',
      });

      res.json({ content: completion.choices[0]?.message?.content || '' });
    } catch (error: any) {
      console.error('Groq Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
