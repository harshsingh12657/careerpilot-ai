import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '📄', title: 'Resume Analyzer', desc: 'Upload your resume and get instant AI-powered feedback, score, and improvement suggestions.' },
  { icon: '🎯', title: 'Skill Gap Analysis', desc: 'Find exactly what skills you need for your dream role and get a prioritized learning plan.' },
  { icon: '🗺️', title: 'Career Roadmap', desc: 'Get a personalized step-by-step roadmap with resources and milestones to reach your goal.' },
  { icon: '🎤', title: 'Mock Interview', desc: 'Practice with an AI interviewer, get real-time feedback and a full performance report.' },
];

const stats = [
  { value: '4+', label: 'AI Features' },
  { value: '100%', label: 'Free to Use' },
  { value: 'AI', label: 'Powered' },
  { value: '24/7', label: 'Available' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-400">CareerPilot AI</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-slate-300 hover:text-white px-4 py-2 rounded-lg transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          🚀 AI-Powered Career Guidance
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Land Your Dream Job<br />
          <span className="text-blue-400">With AI Guidance</span>
        </h1>
        <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
          CareerPilot AI analyzes your resume, identifies skill gaps, builds your career roadmap, and prepares you for interviews — all powered by AI.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg"
          >
            Start For Free →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition text-lg border border-slate-700"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything You Need</h2>
        <p className="text-slate-400 text-center mb-12">Four powerful AI tools to supercharge your career</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Pilot Your Career?</h2>
          <p className="text-white/80 mb-8 text-lg">Join now and get instant access to all AI features — completely free.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition text-lg"
          >
            Get Started Free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 CareerPilot AI — Built with ❤️ as a Final Year Project</p>
      </div>
    </div>
  );
}