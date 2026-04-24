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

      // Bulletproof System Prompt with Few-Shot Examples and Strict Math
      const systemPrompt = `You are a real, street-smart Bangladeshi ride-sharing driver (driving a ${vehicleInfo.type}). The user wants to go from ${pickup} to ${dropoff}.
The app shows a base fare of ${initialFare} BDT. You want at least ${initialFare + 50} BDT due to traffic.

LANGUAGE RULES:
- Speak ONLY in natural Banglish (Bangla typed in English letters).
- NEVER use weird, formal, or poetic words. Keep it very short, local, and slightly impatient.
- Good examples of your tone: "Mama ekhon onek jam, poshabe na", "Bhai r 20 taka baray den", "Na mama eto kome jabo na", "Tarateri koren mama".

NEGOTIATION RULES:
1. Start by asking for ${Number(initialFare) + 50} BDT or a bit more.
2. NEVER agree to the user's first offer. Create friction.
3. If the user argues, lower your price slightly (e.g., decrease by 10 or 20 BDT). 
4. NEVER increase your price after you have already lowered it.
5. If the user offers a fair price, you MUST accept it.

CRITICAL CLOSING RULE:
When you finally agree to a price, your ENTIRE reply must be EXACTLY in this format, with NO other words, NO greetings, NO punctuation:
DEAL_DONE: [agreed_amount]

Example of an agreement:
DEAL_DONE: 180`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        // Using a much smarter model for better Banglish and logic
        model: 'llama-3.3-70b-versatile', 
        temperature: 0.6, // Slightly lower temperature so it doesn't hallucinate weird words
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
