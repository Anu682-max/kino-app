import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MoviePlayer from './pages/MoviePlayer';
import Admin from './pages/Admin';
import BecomeMember from './pages/BecomeMember';
import RequestMembership from './pages/RequestMembership';
import Help from './pages/Help';
import SiteControl from './config/SiteControl';
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
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

function App() {
  // Browser title-г SiteControl-с тохируулах
  useEffect(() => {
    document.title = `${SiteControl.site.siteName} - ${SiteControl.site.siteDescription}`;
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
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

