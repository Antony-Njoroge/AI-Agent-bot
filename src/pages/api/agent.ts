import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  const { prompt } = req.body;

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key not configured." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions ", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
}
