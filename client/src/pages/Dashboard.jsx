import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const features = [
  { title: 'Resume Analyzer', desc: 'AI-powered resume feedback', icon: '📄', path: '/resume', color: 'from-blue-600 to-blue-700' },
  { title: 'Skill Gap Analysis', desc: 'Find missing skills for your dream role', icon: '🎯', path: '/skills', color: 'from-purple-600 to-purple-700' },
  { title: 'Career Roadmap', desc: 'Personalized learning path', icon: '🗺️', path: '/roadmap', color: 'from-green-600 to-green-700' },
  { title: 'Mock Interview', desc: 'Practice with AI interviewer', icon: '🎤', path: '/interview', color: 'from-orange-600 to-orange-700' },
  { title: 'Job Match', desc: 'Find roles matching your profile', icon: '💼', path: '/jobs', color: 'from-teal-600 to-teal-700' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">CareerPilot AI</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 🚀
          </h2>
          <p className="text-slate-400">What would you like to work on today?</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              onClick={() => navigate(feature.path)}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:scale-105 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}