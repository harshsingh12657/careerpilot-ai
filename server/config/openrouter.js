const axios = require('axios');

const askAI = async (prompt) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'google/gemma-3-4b-it:free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'CareerPilot AI',
      },
    }
  );
  return response.data.choices[0].message.content;
};

module.exports = { askAI };