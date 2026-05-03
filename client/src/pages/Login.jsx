import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="grad-text">CareerPilot AI</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Your AI-powered career companion</p>
          </div>

          <div className="glass-card p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Sign in to continue your journey</p>
            </div>

            {error && (
              <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="holo-input" placeholder="you@example.com" required />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="holo-input" placeholder="••••••••" required />
              </div>
              <button type="submit" disabled={loading} className="btn-holo w-full text-white font-semibold py-3 mt-2" style={{ fontSize: '15px' }}>
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#38bdf8' }}>Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}