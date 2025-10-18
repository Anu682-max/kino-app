import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import SiteControl from '../config/SiteControl';
import './Auth.css';

/**
 * ═══════════════════════════════════════════════════════════════════
 * 🔐 НЭГ AUTH COMPONENT - Нэвтрэх & Бүртгүүлэх
 * ═══════════════════════════════════════════════════════════════════
 * Энэ хуудас Login болон Signup-г нэгтгэсэн.
 * Tab ашиглаж хооронд нь солих боломжтой.
 */

export default function Auth() {
  const navigate = useNavigate();
  
  // Tab state: 'login' эсвэл 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃  LOGIN FUNCTION                                             ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      alert('Амжилттай нэвтэрлээ!');
      navigate(SiteControl.auth.redirectAfterLogin);
    } catch (error) {
      console.error('Login error:', error);
      alert(SiteControl.errors.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃  SIGNUP FUNCTION                                            ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Нууц үг шалгах
    if (password.length < SiteControl.auth.passwordRequirements.minLength) {
      alert(`Нууц үг ${SiteControl.auth.passwordRequirements.minLength} тэмдэгтээс их байх ёстой`);
      return;
    }

    if (password !== confirmPassword) {
      alert('Нууц үг таарахгүй байна!');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      alert('Амжилттай бүртгэгдлээ! Одоо нэвтэрч болно.');
      setActiveTab('login');
    } catch (error) {
      console.error('Signup error:', error);
      alert(SiteControl.errors.signupFailed);
    } finally {
      setLoading(false);
    }
  };

  // ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
  // ┃  GOOGLE OAUTH FUNCTION                                      ┃
  // ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${SiteControl.auth.redirectAfterLogin}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google OAuth error:', error);
      alert('Google нэвтрэлт амжилтгүй боллоо');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Лого */}
        <div className="auth-logo">
          <Link to="/">
            <span className="logo-icon">{SiteControl.site.siteLogo}</span>
            <span className="logo-text">{SiteControl.site.siteName}</span>
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <Icon icon="mdi:login" width="20" />
            Нэвтрэх
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            <Icon icon="mdi:account-plus" width="20" />
            Бүртгүүлэх
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Нэвтрэх</h2>
            
            <div className="form-group">
              <label>
                <Icon icon="mdi:email" width="18" />
                Имэйл хаяг
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>
                <Icon icon="mdi:lock" width="18" />
                Нууц үг
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="spin" width="20" />
                  Уншиж байна...
                </>
              ) : (
                <>
                  <Icon icon="mdi:login" width="20" />
                  {SiteControl.auth.emailPassword.loginButtonText}
                </>
              )}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <h2>Бүртгүүлэх</h2>
            
            <div className="form-group">
              <label>
                <Icon icon="mdi:email" width="18" />
                Имэйл хаяг
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>
                <Icon icon="mdi:lock" width="18" />
                Нууц үг
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={SiteControl.auth.passwordRequirements.minLength}
              />
            </div>

            <div className="form-group">
              <label>
                <Icon icon="mdi:lock-check" width="18" />
                Нууц үг давтах
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="spin" width="20" />
                  Бүртгэж байна...
                </>
              ) : (
                <>
                  <Icon icon="mdi:account-plus" width="20" />
                  {SiteControl.auth.emailPassword.signupButtonText}
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        {SiteControl.auth.googleOAuth.enabled && (
          <>
            <div className="auth-divider">
              <span>эсвэл</span>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              className="btn-google"
              type="button"
            >
              <Icon icon={SiteControl.auth.googleOAuth.icon} width="20" />
              {SiteControl.auth.googleOAuth.buttonText}
            </button>
          </>
        )}

        
      </div>
    </div>
  );
}
