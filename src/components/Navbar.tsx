/**
 * ═══════════════════════════════════════════════════════════════════
 * 🧭 NAVIGATION BAR
 * Цэснүүд, хэрэглэгчийн мэдээлэл харуулах component
 * ═══════════════════════════════════════════════════════════════════
 */

import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../hooks/useAuth';
import SiteControl from '../config/SiteControl';
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
      alert('Амжилттай гарлаа!');
      navigate(SiteControl.auth.redirectAfterLogout); // SiteControl-с redirect авах
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
          {SiteControl.site.siteName}
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
                <Icon icon={SiteControl.roles.admin.icon} width="18" />
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
                <span className="user-role role-admin" style={{ color: SiteControl.roles.admin.color }}>
                  <Icon icon={SiteControl.roles.admin.icon} width="18" />
                  {SiteControl.roles.admin.name}
                </span>
              ) : userRole === 'member' ? (
                <span className="user-role role-member" style={{ color: SiteControl.roles.member.color }}>
                  <Icon icon={SiteControl.roles.member.icon} width="18" />
                  {SiteControl.roles.member.name}
                </span>
              ) : (
                <Link to="/become-member" className="user-role role-user" style={{ color: SiteControl.roles.user.color }}>
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
            /* Нэвтрээгүй бол Auth товч */
            <div className="navbar-auth">
              <Link to="/auth" className="btn-auth">
                <Icon icon="mdi:login" width="18" />
                Нэвтрэх
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
