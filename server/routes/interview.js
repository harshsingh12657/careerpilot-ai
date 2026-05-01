const express = require('express');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

// Start interview - get first question
router.post('/start', protect, async (req, res) => {
  try {
    const { role, level, type } = req.body;

    if (!role) return res.status(400).json({ message: 'Role is required' });

    const prompt = `You are a professional interviewer conducting a ${type || 'technical'} interview for a ${level || 'junior'} ${role} position.

Start the interview with a warm welcome message and ask the first interview question.

Respond in this JSON format only:
{
  "message": "<welcome message>",
  "question": "<first interview question>",
  "questionNumber": 1,
  "tips": "<one tip for answering this question>"
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed' });

    res.json({ success: true, data: JSON.parse(jsonMatch[0]) });
  } catch (error) {
    console.error('Interview start error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Submit answer - get feedback + next question
router.post('/answer', protect, async (req, res) => {
  try {
    const { role, level, type, question, answer, questionNumber, history } = req.body;

    if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required' });

    const isLastQuestion = questionNumber >= 5;

    const prompt = `You are a professional interviewer conducting a ${type || 'technical'} interview for a ${level || 'junior'} ${role} position.

Previous conversation:
${history || 'No previous questions'}

Current Question: ${question}
Candidate's Answer: ${answer}

${isLastQuestion ? 
  `This was the last question (5/5). Provide final feedback and end the interview.
  
Respond in this JSON format only:
{
  "feedback": "<detailed feedback on the answer>",
  "score": <number 1-10>,
  "strengths": "<what was good>",
  "improvements": "<what could be better>",
  "isComplete": true,
  "finalReport": {
    "overallScore": <number 1-10>,
    "summary": "<overall interview performance summary>",
    "topStrengths": ["<strength 1>", "<strength 2>"],
    "areasToImprove": ["<area 1>", "<area 2>"],
    "recommendation": "<Hire/Consider/Reject with reason>"
  }
}` 
  : 
  `This is question ${questionNumber} of 5. Provide feedback and ask the next question.
  
Respond in this JSON format only:
{
  "feedback": "<detailed feedback on the answer>",
  "score": <number 1-10>,
  "strengths": "<what was good>",
  "improvements": "<what could be better>",
  "isComplete": false,
  "nextQuestion": "<next interview question>",
  "questionNumber": ${questionNumber + 1},
  "tips": "<one tip for answering the next question>"
}`}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: 'AI response parsing failed' });

    res.json({ success: true, data: JSON.parse(jsonMatch[0]) });
  } catch (error) {
    console.error('Interview answer error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;