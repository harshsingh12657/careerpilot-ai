const express = require('express');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

router.post('/generate', protect, async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const prompt = `You are an expert interview coach. Generate ${count || 5} interview questions and detailed answers for the topic: ${topic}.
Difficulty level: ${difficulty || 'Medium'}

Respond in this JSON format only, no extra text:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "<interview question>",
      "answer": "<detailed model answer>",
      "keyPoints": ["<key point 1>", "<key point 2>", "<key point 3>"],
      "difficulty": "${difficulty || 'Medium'}"
    }
  ]
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed' });

    const data = JSON.parse(jsonMatch[0]);
    res.json({ success: true, data });

  } catch (error) {
    console.error('QA error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post('/evaluate', protect, async (req, res) => {
  try {
    const { question, modelAnswer, userAnswer } = req.body;

    const prompt = `You are an expert interview coach. Evaluate the candidate's answer compared to the model answer.

Question: ${question}
Model Answer: ${modelAnswer}
Candidate's Answer: ${userAnswer}

Respond in this JSON format only:
{
  "score": <number 1-10>,
  "feedback": "<detailed feedback>",
  "missing": ["<missing point 1>", "<missing point 2>"],
  "good": ["<good point 1>", "<good point 2>"]
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed' });

    res.json({ success: true, evaluation: JSON.parse(jsonMatch[0]) });

  } catch (error) {
    console.error('QA evaluate error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;