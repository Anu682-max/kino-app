import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Нэвтрэх нэр эсвэл нууц үг буруу байна');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth нэвтрэх
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (err) {
      setError('Google нэвтрэлтэд алдаа гарлаа');
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Нэвтрэх</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Имэйл</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Нууц үг</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Түр хүлээнэ үү...' : 'Нэвтрэх'}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>эсвэл</span>
        </div>

        {/* Google Sign In */}
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading}
          className="btn-google"
        >
          <Icon icon="mdi:google" width="24" />
          Gmail-р нэвтрэх
        </button>

        <p className="auth-link">
          Бүртгэл байхгүй юу?{' '}
          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
            Бүртгүүлэх
          </a>
        </p>
      </div>
    </div>
  );
}
