// ═══════════════════════════════════════════════════════════════════
// 👥 MEMBER БОЛОХ ХУУДАС - Locked контент үзэхийн тулд member болох
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Navbar';
import './BecomeMember.css';

export default function BecomeMember() {
  const navigate = useNavigate();
  const [loading] = useState(false);

  // Member болох хүсэлт илгээх - Facebook хуудас руу шилжих
  const handleRequestMembership = () => {
    // Facebook хуудас руу шилжих
    window.open('https://www.facebook.com/Ba1jir', '_blank');
  };

  return (
    <div className="become-member-wrapper">
      <Navbar />
      <div className="become-member-container">
        <div className="member-card">
          {/* Header */}
          <div className="member-header">
            <Icon icon="mdi:crown" className="crown-icon" />
            <h1>Member болох</h1>
            <p>Premium контент үзэх боломжтой</p>
          </div>

          {/* Features */}
          <div className="member-features">
            <div className="feature-item">
              <Icon icon="mdi:check-circle" className="feature-icon" />
              <div className="feature-text">
                <h3>Бүх locked кино үзэх</h3>
                <p>Premium контент рүү хязгааргүй хандалт</p>
              </div>
            </div>

            <div className="feature-item">
              <Icon icon="mdi:lightning-bolt" className="feature-icon" />
              <div className="feature-text">
                <h3>Шинэ кино эрт үзэх</h3>
                <p>Шинэ контент хамгийн түрүүнд та үзнэ</p>
              </div>
            </div>

            <div className="feature-item">
              <Icon icon="mdi:quality-high" className="feature-icon" />
              <div className="feature-text">
                <h3>HD чанар</h3>
                <p>1080p болон түүнээс дээш чанарын видео</p>
              </div>
            </div>

            <div className="feature-item">
              <Icon icon="mdi:account-star" className="feature-icon" />
              <div className="feature-text">
                <h3>VIP дэмжлэг</h3>
                <p>Тусгай member онцлогууд болон дэмжлэг</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="member-pricing">
            <div className="price-tag">
              <span className="price">Үнэгүй</span>
              <span className="period">(Одоогоор)</span>
            </div>
            <p className="price-note">
              <Icon icon="mdi:information" />
              Facebook-р холбогдож member эрх авна уу
            </p>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleRequestMembership}
            disabled={loading}
            className="member-button"
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" className="spin-icon" />
                Хүсэлт илгээж байна...
              </>
            ) : (
              <>
                <Icon icon="mdi:facebook" />
                Facebook холбогдох
              </>
            )}
          </button>

          {/* Footer */}
          <div className="member-footer">
            <button onClick={() => navigate(-1)} className="back-link">
              <Icon icon="mdi:arrow-left" />
              Буцах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
