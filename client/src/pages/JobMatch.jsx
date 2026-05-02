import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function JobMatch() {
  const [form, setForm] = useState({ skills: '', experience: '', targetRole: '', preferences: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.skills || !form.targetRole) return setError('Please fill in required fields');
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/jobs/match', form);
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to match jobs');
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
          <h2 className="text-3xl font-bold text-white mb-2">💼 Job Match</h2>
          <p className="text-slate-400">Find the best job roles matching your skills and experience</p>
        </div>

        {!result && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Target Role <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
                placeholder="e.g. Full Stack Developer, Data Analyst, DevOps Engineer"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-2">Your Skills <span className="text-red-400">*</span></label>
              <textarea
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition h-28 resize-none"
                placeholder="e.g. React, Node.js, MongoDB, Python, AWS..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Experience Level</label>
                <select
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 transition"
                >
                  <option value="">Select level</option>
                  <option value="Fresher">Fresher (0 years)</option>
                  <option value="Junior">Junior (1-2 years)</option>
                  <option value="Mid-level">Mid-level (3-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Preferences</label>
                <input
                  type="text"
                  value={form.preferences}
                  onChange={(e) => setForm({ ...form, preferences: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 transition"
                  placeholder="e.g. Remote, Startup, Product company"
                />
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-semibold py-4 rounded-xl transition text-lg"
            >
              {loading ? '🤖 Finding best matches...' : '💼 Find Job Matches'}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Profile Score */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Profile Match Score</h3>
                <p className="text-slate-400 text-sm">{result.profileSummary}</p>
              </div>
              <div className="text-center ml-6">
                <p className="text-5xl font-bold text-teal-400">{result.matchScore}</p>
                <p className="text-slate-400 text-sm">/100</p>
              </div>
            </div>

            {/* Top Roles */}
            <div>
              <h3 className="text-white font-semibold text-xl mb-4">🎯 Top Matching Roles</h3>
              <div className="space-y-4">
                {result.topRoles?.map((role, i) => (
                  <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-teal-500 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-lg">{role.title}</h4>
                        <p className="text-teal-400 text-sm">{role.salary}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-teal-400">{role.match}%</p>
                        <p className="text-slate-500 text-xs">match</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-3">{role.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {role.skills?.map((s, j) => (
                        <span key={j} className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {role.companies?.map((c, j) => (
                          <span key={j} className="bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-1 rounded-full text-xs">{c}</span>
                        ))}
                      </div>
                      <span className="text-slate-400 text-xs">📈 {role.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Add */}
            <div className="bg-slate-800 border border-yellow-500/30 rounded-2xl p-6">
              <h3 className="text-yellow-400 font-semibold text-lg mb-3">⚡ Top Skills to Add</h3>
              <div className="flex flex-wrap gap-2">
                {result.topSkillsToAdd?.map((s, i) => (
                  <span key={i} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded-full text-sm">{s}</span>
                ))}
              </div>
            </div>

            {/* Job Platforms */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">🌐 Where to Apply</h3>
              <div className="space-y-3">
                {result.jobPlatforms?.map((p, i) => (
                  <div key={i} className="bg-slate-700 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-slate-400 text-sm">{p.tip}</p>
                    </div>
                    <a href={p.url} target="_blank" rel="noreferrer" className="text-teal-400 text-sm hover:text-teal-300">Visit →</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Tips */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">💡 Interview Tips</h3>
              <ul className="space-y-2">
                {result.interviewTips?.map((tip, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2">
                    <span className="text-teal-400">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setResult(null); setForm({ skills: '', experience: '', targetRole: '', preferences: '' }); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}