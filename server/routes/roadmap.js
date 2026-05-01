const express = require('express');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { targetRole, currentSkills, experience, timeframe } = req.body;

    if (!targetRole || !currentSkills) {
      return res.status(400).json({ message: 'Target role and current skills are required' });
    }

    const prompt = `You are an expert career coach. Create a detailed career roadmap for someone who wants to become a ${targetRole}.

Current Skills: ${currentSkills}
Experience Level: ${experience || 'Fresher'}
Target Timeframe: ${timeframe || '6 months'}

Respond in this JSON format only, no extra text:
{
  "title": "<Roadmap title>",
  "summary": "<2-3 sentence overview>",
  "totalDuration": "<e.g. 6 months>",
  "phases": [
    {
      "phase": <number>,
      "title": "<phase title>",
      "duration": "<e.g. 2 weeks>",
      "goals": ["<goal 1>", "<goal 2>"],
      "skills": ["<skill 1>", "<skill 2>"],
      "resources": [
        { "name": "<resource name>", "type": "course/book/practice/project", "url": "<url or platform>" }
      ],
      "milestone": "<what you'll be able to do after this phase>"
    }
  ],
  "finalOutcome": "<what you'll achieve at the end>",
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'AI response parsing failed' });
    }

    const roadmap = JSON.parse(jsonMatch[0]);
    res.json({ success: true, roadmap });

  } catch (error) {
    console.error('Roadmap error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;