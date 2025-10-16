import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MoviePlayer from './pages/MoviePlayer';
import Admin from './pages/Admin';
import BecomeMember from './pages/BecomeMember';
import RequestMembership from './pages/RequestMembership';
import Help from './pages/Help';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Home хуудас бүх хүнд харагдана */}
          <Route path="/" element={<Home />} />
          {/* Member болох хуудас */}
          <Route path="/become-member" element={<BecomeMember />} />
          {/* Кино үзэхэд л нэвтрэх шаардлагатай */}
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MoviePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-membership"
            element={
              <ProtectedRoute>
                <RequestMembership />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

