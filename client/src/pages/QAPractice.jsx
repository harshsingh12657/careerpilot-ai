import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const topics = [
  'React.js', 'Node.js', 'JavaScript', 'Python', 'Data Structures',
  'System Design', 'SQL', 'MongoDB', 'CSS', 'Machine Learning',
  'DevOps', 'Git', 'REST APIs', 'TypeScript', 'Docker'
];

export default function QAPractice() {
  const [step, setStep] = useState('setup');
  const [form, setForm] = useState({ topic: '', difficulty: 'Medium', count: '5' });
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeQ, setActiveQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const navigate = useNavigate();

  const generateQuestions = async () => {
    if (!form.topic) return setError('Please select or enter a topic');
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/qa/generate', form);
      setQuestions(data.data.questions);
      setStep('practice');
      setActiveQ(0);
      setShowAnswer(false);
      setUserAnswer('');
      setEvaluation(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const { data } = await API.post('/qa/evaluate', {
        question: questions[activeQ].question,
        modelAnswer: questions[activeQ].answer,
        userAnswer
      });
      setEvaluation(data.evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (activeQ < questions.length - 1) {
      setActiveQ(activeQ + 1);
      setShowAnswer(false);
      setUserAnswer('');
      setEvaluation(null);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CareerPilot AI</h1>
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm">← Back to Dashboard</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">💡 Interview Q&A Practice</h2>
          <p className="text-slate-400">Practice topic-wise questions and get AI feedback on your answers</p>
        </div>

        {/* Setup */}
        {step === 'setup' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-3">Select Topic <span className="text-red-400">*</span></label>
              <div className="flex flex-wrap gap-2 mb-3">
                {topics.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, topic: t })}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${form.topic === t ? 'bg-pink-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition"
                placeholder="Or type a custom topic..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Number of Questions</label>
                <select
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
                >
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

            <button
              onClick={generateQuestions}
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold py-4 rounded-xl transition text-lg"
            >
              {loading ? '🤖 Generating questions...' : '💡 Generate Questions'}
            </button>
          </div>
        )}

        {/* Practice */}
        {step === 'practice' && questions.length > 0 && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-slate-400 text-sm">Question {activeQ + 1} of {questions.length}</span>
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === activeQ ? 'bg-pink-500' : i < activeQ ? 'bg-green-500' : 'bg-slate-600'}`} />
                ))}
              </div>
              <span className="text-pink-400 text-sm font-medium">{form.topic}</span>
            </div>

            {/* Question */}
            <div className="bg-slate-800 border border-pink-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-pink-400 text-sm font-medium">Q{activeQ + 1}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  questions[activeQ].difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                  questions[activeQ].difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>{questions[activeQ].difficulty}</span>
              </div>
              <p className="text-white text-lg font-medium">{questions[activeQ].question}</p>
            </div>

            {/* User Answer */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <label className="block text-slate-300 font-medium mb-3">Your Answer</label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition h-32 resize-none"
                placeholder="Write your answer before revealing the model answer..."
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={evaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                >
                  {evaluating ? '🤖 Evaluating...' : '✅ Evaluate My Answer'}
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                >
                  {showAnswer ? '🙈 Hide Answer' : '👁️ Show Model Answer'}
                </button>
              </div>
            </div>

            {/* Evaluation */}
            {evaluation && (
              <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-blue-400 font-semibold">AI Evaluation</h4>
                  <span className={`text-2xl font-bold ${getScoreColor(evaluation.score)}`}>{evaluation.score}/10</span>
                </div>
                <p className="text-slate-300 text-sm">{evaluation.feedback}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <p className="text-green-400 text-xs font-medium mb-2">✅ Good Points</p>
                    <ul className="space-y-1">
                      {evaluation.good?.map((g, i) => <li key={i} className="text-slate-300 text-xs">• {g}</li>)}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-medium mb-2">❌ Missing Points</p>
                    <ul className="space-y-1">
                      {evaluation.missing?.map((m, i) => <li key={i} className="text-slate-300 text-xs">• {m}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Model Answer */}
            {showAnswer && (
              <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6 space-y-4">
                <h4 className="text-green-400 font-semibold">📖 Model Answer</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{questions[activeQ].answer}</p>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-2">🔑 Key Points:</p>
                  <ul className="space-y-1">
                    {questions[activeQ].keyPoints?.map((kp, i) => (
                      <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-green-400">•</span>{kp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('setup')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
              >
                ← New Topic
              </button>
              {activeQ < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  🎉 Practice Complete!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}