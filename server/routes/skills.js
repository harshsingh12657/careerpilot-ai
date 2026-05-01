const express = require('express');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

router.post('/analyze', protect, async (req, res) => {
  try {
    const { currentSkills, targetRole, experience } = req.body;

    if (!currentSkills || !targetRole) {
      return res.status(400).json({ message: 'Current skills and target role are required' });
    }

    const prompt = `You are an expert career coach. Analyze the skill gap between a candidate's current skills and their target role.

Current Skills: ${currentSkills}
Target Role: ${targetRole}
Experience Level: ${experience || 'Not specified'}

Respond in this JSON format only, no extra text:
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence assessment>",
  "missingSkills": [
    { "skill": "<skill name>", "priority": "high/medium/low", "reason": "<why needed>" }
  ],
  "strongSkills": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "learningPath": [
    { "skill": "<skill>", "resource": "<recommended resource>", "timeframe": "<e.g. 2 weeks>" }
  ],
  "jobReadiness": "<Not Ready/Partially Ready/Almost Ready/Ready>"
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'AI response parsing failed' });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Skill gap error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;