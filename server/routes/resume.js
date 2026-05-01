const express = require('express');
const multer = require('multer');
const { PdfReader } = require('pdfreader');
const { protect } = require('../middleware/auth');
const { askAI } = require('../config/openrouter');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  }
});

const extractTextFromPDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const reader = new PdfReader();
    let text = '';
    reader.parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(text);
      if (item.text) text += item.text + ' ';
    });
  });
};

router.post('/analyze', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    const prompt = `You are an expert career coach and resume reviewer. Analyze the following resume and provide detailed feedback.

Resume Content:
${resumeText}

Provide your analysis in the following JSON format only, no extra text:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>"],
  "keywords": ["<keyword 1>", "<keyword 2>", "<keyword 3>", "<keyword 4>", "<keyword 5>"],
  "sections": {
    "contact": <true/false>,
    "summary": <true/false>,
    "experience": <true/false>,
    "education": <true/false>,
    "skills": <true/false>,
    "projects": <true/false>
  }
}`;

    const aiResponse = await askAI(prompt);
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: 'AI response parsing failed' });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    res.json({ success: true, analysis });

  } catch (error) {
    console.error('Resume analyze error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;