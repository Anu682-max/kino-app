import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }

    if (password.length < 6) {
      setError('Нууц үг 6-с дээш тэмдэгт байх ёстой');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Бүртгэл үүсгэхэд алдаа гарлаа';
      setError(errorMessage);
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
        <h1>Бүртгүүлэх</h1>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Нууц үг давтах</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Түр хүлээнэ үү...' : 'Бүртгүүлэх'}
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
          Gmail-р бүртгүүлэх
        </button>

        <p className="auth-link">
          Бүртгэлтэй юу?{' '}
          <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
            Нэвтрэх
          </a>
        </p>
      </div>
    </div>
  );
}
