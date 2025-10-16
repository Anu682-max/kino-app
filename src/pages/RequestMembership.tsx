import Navbar from '../components/Navbar';
import './RequestMembership.css';

export default function RequestMembership() {
  // Та энд өөрийн Facebook Messenger холбоосоо оруулна уу
  const facebookMessengerLink = 'https://www.facebook.com/Ba1jir';

  return (
    <div>
      <Navbar />
      <div className="request-container">
        <div className="request-card">
          <div className="request-icon">⭐</div>
          <h1>Member болох</h1>
          <p className="request-description">
            Member болж, бүх locked кино контентуудыг үзээрэй!
          </p>

          <div className="benefits-list">
            <h3>Member-ийн давуу тал:</h3>
            <ul>
              <li>✅ Бүх locked кино контентууд</li>
              <li>✅ Шинэ киног эхэнд үзэх боломж</li>
              <li>✅ Онцгой контентууд</li>
              <li>✅ Зар сурталчилгаагүй</li>
            </ul>
          </div>

          <div className="contact-section">
            <p className="contact-text">
              Member болохын тулд манай админтай Facebook Messenger-ээр холбогдоно уу:
            </p>
            <a 
              href={facebookMessengerLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-messenger"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.897 1.445 5.487 3.705 7.184V22l3.46-1.898c.923.257 1.9.398 2.835.398 5.523 0 10-4.145 10-9.257S17.523 2 12 2zm.945 12.48l-2.567-2.739-5.006 2.739 5.507-5.844 2.631 2.739 4.942-2.739-5.507 5.844z"/>
              </svg>
              Messenger дээр холбогдох
            </a>
          </div>

          <div className="info-note">
            <p>
              💡 <strong>Анхаар:</strong> Админ таны хүсэлтийг шалгаад, тантай холбогдох болно. 
              Имэйл хаягаа дурьдахаа мартуузай.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
