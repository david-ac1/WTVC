import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/detect', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const prompt = `
You are an AI code reviewer. Determine how likely this code is AI-generated (0–100%). Respond in JSON:
{ "aiScore": 85, "reason": "..." }

CODE:
${code}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content || '';
    const match = content.match(/{[\s\S]*}/);
    const parsed = match ? JSON.parse(match[0]) : null;

    res.json(parsed || { aiScore: -1, reason: 'Could not parse response.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI request failed.' });
  }
});

app.listen(port, () => console.log(`AI detector running on http://localhost:${port}`));
