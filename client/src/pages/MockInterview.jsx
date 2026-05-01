import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function MockInterview() {
  const [step, setStep] = useState('setup'); // setup, interview, complete
  const [form, setForm] = useState({ role: '', level: 'Junior', type: 'Technical' });
  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const navigate = useNavigate();

  const startInterview = async () => {
    if (!form.role) return setError('Please enter the role');
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/interview/start', form);
      setInterview(data.data);
      setStep('interview');
      setHistory([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return setError('Please provide an answer');
    setLoading(true);
    setError('');
    try {
      const historyText = history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n');
      const { data } = await API.post('/interview/answer', {
        role: form.role,
        level: form.level,
        type: form.type,
        question: interview.question,
        answer,
        questionNumber: interview.questionNumber,
        history: historyText
      });

      const newHistory = [...history, { question: interview.question, answer, feedback: data.data }];
      setHistory(newHistory);
      setFeedback(data.data);

      if (data.data.isComplete) {
        setFinalReport(data.data.finalReport);
        setStep('complete');
      } else {
        setInterview({ ...interview, question: data.data.nextQuestion, questionNumber: data.data.questionNumber, tips: data.data.tips });
        setAnswer('');
        setFeedback(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
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
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm transition">← Back to Dashboard</button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🎤 Mock Interview</h2>
          <p className="text-slate-400">Practice with an AI interviewer and get instant feedback</p>
        </div>

        {/* Setup */}
        {step === 'setup' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Job Role <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="e.g. React Developer, Data Scientist, DevOps Engineer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Experience Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option>Fresher</option>
                  <option>Junior</option>
                  <option>Mid-level</option>
                  <option>Senior</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Interview Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option>Technical</option>
                  <option>HR</option>
                  <option>Behavioral</option>
                  <option>System Design</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-700 rounded-xl p-4">
              <p className="text-slate-300 text-sm">📋 <strong>How it works:</strong> You'll be asked 5 questions. After each answer, you'll get instant AI feedback on your response. At the end, you'll receive a full interview report.</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white font-semibold py-4 rounded-xl transition text-lg"
            >
              {loading ? '🤖 Setting up interview...' : '🎤 Start Interview'}
            </button>
          </div>
        )}

        {/* Interview */}
        {step === 'interview' && interview && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Question {interview.questionNumber} of 5</span>
                <span className="text-slate-400 text-sm">{form.role} — {form.type}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(interview.questionNumber / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Welcome message (first question only) */}
            {interview.message && (
              <div className="bg-slate-700 rounded-2xl p-6">
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">🤖</span>
                  <p className="text-slate-300">{interview.message}</p>
                </div>
              </div>
            )}

            {/* Question */}
            <div className="bg-slate-800 border border-orange-500/30 rounded-2xl p-6">
              <p className="text-orange-400 text-sm font-medium mb-3">Question {interview.questionNumber}</p>
              <p className="text-white text-lg font-medium">{interview.question}</p>
              {interview.tips && (
                <div className="mt-4 bg-slate-700 rounded-xl p-3">
                  <p className="text-slate-400 text-sm">💡 <span className="text-yellow-400">Tip:</span> {interview.tips}</p>
                </div>
              )}
            </div>

            {/* Feedback from previous answer */}
            {feedback && (
              <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-blue-400 font-semibold">Feedback on previous answer</h4>
                  <span className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>{feedback.score}/10</span>
                </div>
                <p className="text-slate-300 text-sm">{feedback.feedback}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 rounded-lg p-3">
                    <p className="text-green-400 text-xs font-medium mb-1">✅ Strengths</p>
                    <p className="text-slate-300 text-sm">{feedback.strengths}</p>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-3">
                    <p className="text-red-400 text-xs font-medium mb-1">📈 Improve</p>
                    <p className="text-slate-300 text-sm">{feedback.improvements}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Answer input */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <label className="block text-slate-300 font-medium mb-3">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition h-40 resize-none"
                placeholder="Type your answer here... Be specific and use examples where possible."
              />
              {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}
              <button
                onClick={submitAnswer}
                disabled={loading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white font-semibold py-3 rounded-xl transition"
              >
                {loading ? '🤖 Evaluating answer...' : `Submit Answer →`}
              </button>
            </div>
          </div>
        )}

        {/* Complete */}
        {step === 'complete' && finalReport && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 text-center">
              <p className="text-white/80 text-lg mb-2">Interview Complete! 🎉</p>
              <p className="text-6xl font-bold text-white mb-2">{finalReport.overallScore}</p>
              <p className="text-white/80">/10 Overall Score</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">📋 Summary</h3>
              <p className="text-slate-300">{finalReport.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-green-400 font-semibold mb-3">💪 Top Strengths</h3>
                <ul className="space-y-2">
                  {finalReport.topStrengths?.map((s, i) => (
                    <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-green-400">•</span>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800 border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-red-400 font-semibold mb-3">📈 Improve On</h3>
                <ul className="space-y-2">
                  {finalReport.areasToImprove?.map((a, i) => (
                    <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-red-400">•</span>{a}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-blue-400 font-semibold mb-2">🏆 Recommendation</h3>
              <p className="text-white">{finalReport.recommendation}</p>
            </div>

            {/* Question History */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">📝 Interview History</h3>
              <div className="space-y-4">
                {history.map((h, i) => (
                  <div key={i} className="border border-slate-700 rounded-xl p-4">
                    <p className="text-orange-400 text-sm font-medium mb-1">Q{i + 1}: {h.question}</p>
                    <p className="text-slate-400 text-sm mb-2">Your answer: {h.answer.substring(0, 100)}...</p>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${getScoreColor(h.feedback.score)}`}>{h.feedback.score}/10</span>
                      <span className="text-slate-500 text-sm">{h.feedback.strengths}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setStep('setup'); setHistory([]); setFeedback(null); setFinalReport(null); setAnswer(''); }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-xl transition"
            >
              Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}