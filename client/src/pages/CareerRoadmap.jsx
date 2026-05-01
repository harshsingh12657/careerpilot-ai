import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const resourceIcons = { course: '🎓', book: '📚', practice: '💻', project: '🛠️' };

export default function CareerRoadmap() {
  const [form, setForm] = useState({ targetRole: '', currentSkills: '', experience: '', timeframe: '' });
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');
  const [expandedPhase, setExpandedPhase] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.targetRole || !form.currentSkills) return setError('Please fill in required fields');
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/roadmap/generate', form);
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed');
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
          <h2 className="text-3xl font-bold text-white mb-2">🗺️ Career Roadmap Generator</h2>
          <p className="text-slate-400">Get a personalized step-by-step learning path to your dream role</p>
        </div>

        {!roadmap && (
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
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition h-28 resize-none"
                placeholder="e.g. HTML, CSS, JavaScript, React basics..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Experience Level</label>
                <select
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select level</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid-level">Mid-level (3-5 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-2">Target Timeframe</label>
                <select
                  value={form.timeframe}
                  onChange={(e) => setForm({ ...form, timeframe: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="">Select timeframe</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                </select>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-semibold py-4 rounded-xl transition text-lg"
            >
              {loading ? '🤖 Generating your roadmap...' : '🗺️ Generate Roadmap'}
            </button>
          </div>
        )}

        {roadmap && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">{roadmap.title}</h3>
              <p className="text-white/80 mb-4">{roadmap.summary}</p>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">⏱️ {roadmap.totalDuration}</span>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">📌 {roadmap.phases?.length} Phases</span>
              </div>
            </div>

            {/* Phases */}
            <div className="space-y-4">
              {roadmap.phases?.map((phase, i) => (
                <div key={i} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                  <div
                    className="p-6 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedPhase(expandedPhase === i ? -1 : i)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">{phase.phase}</div>
                      <div>
                        <h4 className="text-white font-semibold">{phase.title}</h4>
                        <p className="text-slate-400 text-sm">⏱️ {phase.duration}</p>
                      </div>
                    </div>
                    <span className="text-slate-400">{expandedPhase === i ? '▲' : '▼'}</span>
                  </div>

                  {expandedPhase === i && (
                    <div className="px-6 pb-6 space-y-4 border-t border-slate-700 pt-4">
                      {/* Goals */}
                      <div>
                        <h5 className="text-slate-300 font-medium mb-2">🎯 Goals</h5>
                        <ul className="space-y-1">
                          {phase.goals?.map((g, j) => (
                            <li key={j} className="text-slate-400 text-sm flex gap-2"><span className="text-green-400">•</span>{g}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div>
                        <h5 className="text-slate-300 font-medium mb-2">🛠️ Skills to Learn</h5>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills?.map((s, j) => (
                            <span key={j} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h5 className="text-slate-300 font-medium mb-2">📚 Resources</h5>
                        <div className="space-y-2">
                          {phase.resources?.map((r, j) => (
                            <div key={j} className="bg-slate-700 rounded-lg p-3 flex items-center gap-3">
                              <span>{resourceIcons[r.type] || '📌'}</span>
                              <div>
                                <p className="text-white text-sm font-medium">{r.name}</p>
                                <p className="text-slate-400 text-xs">{r.url}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Milestone */}
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                        <p className="text-green-400 text-sm"><span className="font-semibold">🏆 Milestone:</span> {phase.milestone}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final Outcome */}
            <div className="bg-slate-800 border border-teal-500/30 rounded-2xl p-6">
              <h3 className="text-teal-400 font-semibold text-lg mb-2">🎓 Final Outcome</h3>
              <p className="text-slate-300">{roadmap.finalOutcome}</p>
            </div>

            {/* Tips */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2">
                {roadmap.tips?.map((tip, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-2"><span className="text-yellow-400">★</span>{tip}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => { setRoadmap(null); setForm({ targetRole: '', currentSkills: '', experience: '', timeframe: '' }); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Generate Another Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}