import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // Check if the API key is set
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API key not configured.' });
  }

  try {
    // Call OpenRouter AI API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions ', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      return res.status(500).json({ error: 'Failed to get response from AI model.' });
    }

    // Parse and return the result
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
