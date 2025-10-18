// ═══════════════════════════════════════════════════════════════════
// 👥 MEMBER БОЛОХ ХУУДАС - Locked контент үзэхийн тулд member болох
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Navbar from '../components/Navbar';
import SiteControl from '../config/SiteControl';
import './BecomeMember.css';

export default function BecomeMember() {
  const navigate = useNavigate();
  const [loading] = useState(false);

  // Member болох хүсэлт илгээх - Facebook хуудас руу шилжих
  const handleRequestMembership = () => {
    // SiteControl-с Facebook link авах
    window.open(SiteControl.social.facebook, '_blank');
  };

  return (
    <div className="become-member-wrapper">
      <Navbar />
      <div className="become-member-container">
        <div className="member-card">
          {/* Header */}
          <div className="member-header">
            <Icon icon="mdi:crown" className="crown-icon" />
            <h1>{SiteControl.member.title}</h1>
            <p>{SiteControl.member.subtitle}</p>
          </div>

          {/* Features */}
          <div className="member-features">
            {SiteControl.member.benefits.map((benefit, index) => (
              <div key={index} className="feature-item">
                <Icon icon="mdi:check-circle" className="feature-icon" />
                <div className="feature-text">
                  <p>{benefit}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="member-pricing">
            <div className="price-tag">
              <span className="price">{SiteControl.member.pricing}</span>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bank-info">
            <h3>💰 Төлбөрийн мэдээлэл</h3>
            <div className="bank-details">
              <p>{SiteControl.member.bankInfo.bank}</p>
              <p>{SiteControl.member.bankInfo.account}</p>
              <p>{SiteControl.member.bankInfo.iban}</p>
              <p>{SiteControl.member.bankInfo.receiver}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="member-steps">
            <h3>📋 Хэрхэн member болох вэ?</h3>
            {SiteControl.member.steps.map((step, index) => (
              <div key={index} className="step-item">
                <p>{step}</p>
              </div>
            ))}
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
                {SiteControl.member.buttonText}
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
