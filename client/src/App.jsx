import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import SkillGap from './pages/SkillGap';
import CareerRoadmap from './pages/CareerRoadmap';
import MockInterview from './pages/MockInterview';
import QAPractice from './pages/QAPractice';
import Landing from './pages/Landing';
import JobMatch from './pages/JobMatch';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/resume" element={<PrivateRoute><ResumeAnalyzer /></PrivateRoute>} />
      <Route path="/skills" element={<PrivateRoute><SkillGap /></PrivateRoute>} />
      <Route path="/roadmap" element={<PrivateRoute><CareerRoadmap /></PrivateRoute>} />
      <Route path="/interview" element={<PrivateRoute><MockInterview /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/jobs" element={<PrivateRoute><JobMatch /></PrivateRoute>} />
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}