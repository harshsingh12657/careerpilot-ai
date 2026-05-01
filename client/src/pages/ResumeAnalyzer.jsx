import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload a resume first');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await API.post('/resume/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-600 to-green-700';
    if (score >= 60) return 'from-yellow-600 to-yellow-700';
    return 'from-red-600 to-red-700';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CareerPilot AI</h1>
        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white text-sm transition">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">📄 Resume Analyzer</h2>
          <p className="text-slate-400">Upload your resume and get AI-powered feedback instantly</p>
        </div>

        {/* Upload Section */}
        {!analysis && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div
              className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => document.getElementById('resumeInput').click()}
            >
              <div className="text-5xl mb-4">📎</div>
              <p className="text-white font-medium text-lg mb-2">
                {file ? file.name : 'Click to upload your resume'}
              </p>
              <p className="text-slate-400 text-sm">PDF files only, max 5MB</p>
              <input
                id="resumeInput"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {file && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-4 rounded-xl transition text-lg"
              >
                {loading ? '🤖 Analyzing your resume...' : '🚀 Analyze Resume'}
              </button>
            )}
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {/* Score */}
            <div className={`bg-gradient-to-r ${getScoreBg(analysis.score)} rounded-2xl p-8 text-center`}>
              <p className="text-white/80 text-lg mb-2">Resume Score</p>
              <p className="text-7xl font-bold text-white mb-2">{analysis.score}</p>
              <p className="text-white/80">/100</p>
            </div>

            {/* Summary */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">📋 Summary</h3>
              <p className="text-slate-300">{analysis.summary}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-green-400 font-semibold text-lg mb-3">✅ Strengths</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-slate-300 text-sm flex gap-2">
                      <span className="text-green-400">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800 border border-red-500/30 rounded-2xl p-6">
                <h3 className="text-red-400 font-semibold text-lg mb-3">❌ Weaknesses</h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-slate-300 text-sm flex gap-2">
                      <span className="text-red-400">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-blue-400 font-semibold text-lg mb-3">💡 Suggestions</h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-slate-300 text-sm flex gap-3">
                    <span className="text-blue-400 font-bold">{i + 1}.</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">🏷️ Key Skills Detected</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((k, i) => (
                  <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                    {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Sections Checklist */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-3">📑 Resume Sections</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(analysis.sections).map(([key, value]) => (
                  <div key={key} className={`flex items-center gap-2 p-3 rounded-lg ${value ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <span>{value ? '✅' : '❌'}</span>
                    <span className="text-slate-300 text-sm capitalize">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setAnalysis(null); setFile(null); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}