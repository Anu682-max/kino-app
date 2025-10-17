/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧭 NAVIGATION BAR
 * Цэснүүд, хэрэглэгчийн мэдээлэл харуулах component
 * ═══════════════════════════════════════════════════════════════════
 */

import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  // Хэрэглэгчийн мэдээлэл
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  /**
   * Гарах функц
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login'); // Login хуудас руу шилжих
    } catch (error) {
      console.error('❌ Гарахад алдаа:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Лого */}
        <Link to="/" className="navbar-logo">
          <Icon icon="mdi:movie-open" width="32" height="32" />
          Кино Сайт
        </Link>
        
        <div className="navbar-menu">
          {/* Нүүр цэс */}
          <Link to="/" className="navbar-link">
            Нүүр
          </Link>
          
          {/* Админ цэснүүд (зөвхөн admin-д харагдана) */}
          {userRole === 'admin' && (
            <>
              <Link to="/admin" className="navbar-link admin-link">
                <Icon icon="mdi:shield-crown" width="18" />
                Админ
              </Link>
              <Link to="/help" className="navbar-link">
                <Icon icon="mdi:book-open" width="18" />
                Заавар
              </Link>
            </>
          )}
          
          {/* Хэрэглэгч нэвтэрсэн бол */}
          {user ? (
            <div className="navbar-user">
              {/* Хэрэглэгчийн эрх харуулах / Member болох */}
              {userRole === 'admin' ? (
                <span className="user-role role-admin">
                  <Icon icon="mdi:shield-crown" width="18" />
                  Админ
                </span>
              ) : userRole === 'member' ? (
                <span className="user-role role-member">
                  <Icon icon="mdi:star" width="18" />
                  Гишүүн
                </span>
              ) : (
                <Link to="/become-member" className="user-role role-user">
                  <Icon icon="mdi:account-plus" width="18" />
                  Member болох
                </Link>
              )}
              {/* Гарах товч */}
              <button onClick={handleSignOut} className="btn-signout">
                <Icon icon="mdi:logout" width="18" />
                Гарах
              </button>
            </div>
          ) : (
            /* Нэвтрээгүй бол Login/Signup товчнууд */
            <div className="navbar-auth">
              <Link to="/login" className="navbar-link">
                Нэвтрэх
              </Link>
              <Link to="/signup" className="btn-signup">
                Бүртгүүлэх
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
