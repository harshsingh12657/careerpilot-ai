import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const features = [
  { title: 'Resume Analyzer', desc: 'AI-powered resume feedback & scoring', tag: 'tag-pink', tagLabel: 'Resume', path: '/resume', accent: '#f43f5e' },
  { title: 'Skill Gap Analysis', desc: 'Find missing skills for your dream role', tag: 'tag-blue', tagLabel: 'Skills', path: '/skills', accent: '#38bdf8' },
  { title: 'Career Roadmap', desc: 'Personalized step-by-step learning path', tag: 'tag-purple', tagLabel: 'Roadmap', path: '/roadmap', accent: '#a78bfa' },
  { title: 'Mock Interview', desc: 'Practice with AI interviewer', tag: 'tag-green', tagLabel: 'Interview', path: '/interview', accent: '#34d399' },
  { title: 'Job Match', desc: 'Find roles matching your profile', tag: 'tag-teal', tagLabel: 'Jobs', path: '/jobs', accent: '#2dd4bf' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Nav */}
      <nav className="holo-nav px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold grad-text">CareerPilot AI</h1>
          <div className="flex items-center gap-4">
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>👋 {user?.name}</span>
            <button onClick={() => { logout(); navigate('/login'); }} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="tag-pink inline-block mb-4">AI Career Platform</div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Welcome back, <span className="grad-text">{user?.name?.split(' ')[0]}</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '15px' }}>Your AI-powered career tools are ready. What are we working on today?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'AI Features', value: '5' },
            { label: 'Always Free', value: '100%' },
            { label: 'AI Powered', value: '24/7' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 text-center">
              <p className="text-3xl font-bold grad-text mb-1">{stat.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              onClick={() => navigate(f.path)}
              className="glass-card p-6 cursor-pointer group"
              style={{ transition: 'all 0.3s ease' }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className={f.tag}>{f.tagLabel}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px', transition: 'all 0.2s' }}>→</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>{f.desc}</p>
              <div style={{ height: '1px', background: `linear-gradient(90deg, ${f.accent}40, transparent)`, marginTop: '16px' }} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}