const axios = require('axios');

const askAI = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
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
    } catch (error) {
      if (error.response?.status === 429 && i < retries - 1) {
        console.log(`Rate limited, waiting 3 seconds... (attempt ${i + 1})`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
      }
    }
  }
};

module.exports = { askAI };