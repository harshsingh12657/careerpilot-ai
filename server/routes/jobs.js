const express = require('express');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

router.post('/match', protect, async (req, res) => {
  try {
    const { skills, experience, targetRole, preferences } = req.body;

    if (!skills || !targetRole) {
      return res.status(400).json({ message: 'Skills and target role are required' });
    }

    const prompt = `You are an expert career counselor and job market analyst. Based on the candidate's profile, suggest the best matching job roles and opportunities.

Candidate Profile:
- Skills: ${skills}
- Experience Level: ${experience || 'Fresher'}
- Target Role: ${targetRole}
- Preferences: ${preferences || 'No specific preferences'}

Respond in this JSON format only, no extra text:
{
  "profileSummary": "<2 sentence summary of candidate profile>",
  "matchScore": <number 0-100>,
  "topRoles": [
    {
      "title": "<job title>",
      "match": <number 0-100>,
      "salary": "<salary range in INR>",
      "skills": ["<required skill 1>", "<required skill 2>", "<required skill 3>"],
      "description": "<2 sentence job description>",
      "companies": ["<company 1>", "<company 2>", "<company 3>"],
      "growth": "<career growth potential>"
    }
  ],
  "topSkillsToAdd": ["<skill 1>", "<skill 2>", "<skill 3>"],
  "jobPlatforms": [
    { "name": "<platform name>", "url": "<url>", "tip": "<search tip>" }
  ],
  "interviewTips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed' });

    const data = JSON.parse(jsonMatch[0]);
    res.json({ success: true, data });

  } catch (error) {
    console.error('Job match error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;