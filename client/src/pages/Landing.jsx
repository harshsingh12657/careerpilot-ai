import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const features = [
  { tag: 'tag-pink', tagLabel: 'Resume', title: 'Resume Analyzer', desc: 'Upload your resume and get instant AI-powered feedback, score, and improvement suggestions.', accent: '#f43f5e' },
  { tag: 'tag-blue', tagLabel: 'Skills', title: 'Skill Gap Analysis', desc: 'Find exactly what skills you need for your dream role with a prioritized learning plan.', accent: '#38bdf8' },
  { tag: 'tag-purple', tagLabel: 'Roadmap', title: 'Career Roadmap', desc: 'Get a personalized step-by-step roadmap with resources and milestones.', accent: '#a78bfa' },
  { tag: 'tag-green', tagLabel: 'Interview', title: 'Mock Interview', desc: 'Practice with an AI interviewer and get real-time feedback and a performance report.', accent: '#34d399' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Nav */}
      <nav className="holo-nav px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold grad-text">CareerPilot AI</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '8px 18px', fontSize: '13px' }}>Login</button>
            <button onClick={() => navigate('/register')} className="btn-holo" style={{ padding: '8px 18px', fontSize: '13px' }}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-28 text-center">
        <div className="tag-blue inline-block mb-6">AI-Powered Career Guidance Platform</div>
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Land Your Dream Job<br />
          <span className="grad-text">With AI Guidance</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px' }}>
          CareerPilot AI analyzes your resume, identifies skill gaps, builds your career roadmap, and prepares you for interviews.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/register')} className="btn-holo" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Start For Free →
          </button>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Sign In
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '5+', label: 'AI Features' },
            { value: '100%', label: 'Free to Use' },
            { value: 'AI', label: 'Powered' },
            { value: '24/7', label: 'Available' },
          ].map((s) => (
            <div key={s.label} className="glass-card p-6 text-center">
              <p className="text-3xl font-bold grad-text mb-1">{s.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything You Need</h2>
          <p style={{ color: 'rgba(255,255,255,0.3)' }}>Four powerful AI tools to supercharge your career</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-8">
              <span className={f.tag}>{f.tagLabel}</span>
              <h3 className="text-white font-semibold text-xl mt-4 mb-2">{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>{f.desc}</p>
              <div style={{ height: '1px', background: `linear-gradient(90deg, ${f.accent}40, transparent)`, marginTop: '20px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 mb-24">
        <div className="glass-card p-16 text-center" style={{ border: '1px solid rgba(167,139,250,0.15)' }}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to <span className="grad-text">Pilot Your Career?</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '32px' }}>Join now and get instant access to all AI features — completely free.</p>
          <button onClick={() => navigate('/register')} className="btn-holo" style={{ padding: '14px 32px', fontSize: '16px' }}>
            Get Started Free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
        © 2024 CareerPilot AI — Built with ❤️ as a Final Year Project
      </div>
    </Layout>
  );
}