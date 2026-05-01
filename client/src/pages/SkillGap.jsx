import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const priorities = { high: 'bg-red-500/20 text-red-400 border-red-500/30', medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', low: 'bg-green-500/20 text-green-400 border-green-500/30' };
const readinessColor = { 'Not Ready': 'text-red-400', 'Partially Ready': 'text-orange-400', 'Almost Ready': 'text-yellow-400', 'Ready': 'text-green-400' };

export default function SkillGap() {
  const [form, setForm] = useState({ currentSkills: '', targetRole: '', experience: '' });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.currentSkills || !form.targetRole) return setError('Please fill in all required fields');
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/skills/analyze', form);
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CareerPilot AI</h1>
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm transition">← Back to Dashboard</button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">🎯 Skill Gap Analysis</h2>
          <p className="text-slate-400">Find out what skills you need for your dream role</p>
        </div>

        {!analysis && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Target Role <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="e.g. Full Stack Developer, Data Scientist, DevOps Engineer"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Your Current Skills <span className="text-red-400">*</span></label>
              <textarea
                value={form.currentSkills}
                onChange={(e) => setForm({ ...form, currentSkills: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition h-32 resize-none"
                placeholder="e.g. Python, HTML, CSS, JavaScript, React basics, MySQL..."
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Experience Level</label>
              <select
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher (0 years)</option>
                <option value="Junior">Junior (1-2 years)</option>
                <option value="Mid-level">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-4 rounded-xl transition text-lg"
            >
              {loading ? '🤖 Analyzing skill gap...' : '🎯 Analyze Skill Gap'}
            </button>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Match Score */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 flex items-center justify-between">
              <div>
                <p className="text-slate-400 mb-1">Match Score for <span className="text-white font-semibold">{form.targetRole}</span></p>
                <p className={`text-2xl font-bold ${readinessColor[analysis.jobReadiness]}`}>{analysis.jobReadiness}</p>
                <p className="text-slate-400 text-sm mt-2">{analysis.summary}</p>
              </div>
              <div className="text-center">
                <p className="text-6xl font-bold text-purple-400">{analysis.matchScore}</p>
                <p className="text-slate-400 text-sm">/100</p>
              </div>
            </div>

            {/* Strong Skills */}
            <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-green-400 font-semibold text-lg mb-3">💪 Your Strong Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.strongSkills.map((s, i) => (
                  <span key={i} className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">🚨 Missing Skills</h3>
              <div className="space-y-3">
                {analysis.missingSkills.map((item, i) => (
                  <div key={i} className={`border rounded-xl p-4 ${priorities[item.priority]}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{item.skill}</span>
                      <span className="text-xs uppercase font-bold px-2 py-1 rounded-full border">{item.priority}</span>
                    </div>
                    <p className="text-sm opacity-80">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-blue-400 font-semibold text-lg mb-4">📚 Learning Path</h3>
              <div className="space-y-3">
                {analysis.learningPath.map((item, i) => (
                  <div key={i} className="bg-slate-700 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{item.skill}</p>
                      <p className="text-slate-400 text-sm">{item.resource}</p>
                    </div>
                    <span className="text-blue-400 text-sm font-medium">{item.timeframe}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setAnalysis(null); setForm({ currentSkills: '', targetRole: '', experience: '' }); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Analyze Another Role
            </button>
          </div>
        )}
      </div>
    </div>
  );
}