import { useState } from 'react';
import Navbar from '../components/Navbar';
import './Help.css';

export default function Help() {
  const [activeTab, setActiveTab] = useState<'youtube' | 'drive' | 'mega'>('youtube');

  return (
    <div>
      <Navbar />
      <div className="help-container">
        <h1 className="help-title">📚 Кино оруулах заавар</h1>

        <div className="help-tabs">
          <button
            className={`help-tab ${activeTab === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            YouTube ашиглах (Санал болгож байна)
          </button>
          <button
            className={`help-tab ${activeTab === 'mega' ? 'active' : ''}`}
            onClick={() => setActiveTab('mega')}
          >
            MEGA.nz ашиглах (20GB үнэгүй)
          </button>
          <button
            className={`help-tab ${activeTab === 'drive' ? 'active' : ''}`}
            onClick={() => setActiveTab('drive')}
          >
            Google Drive ашиглах
          </button>
        </div>

        {activeTab === 'youtube' && (
          <div className="help-content">
            <div className="help-section">
              <h2>🎥 YouTube ашиглан кино оруулах</h2>
              <p className="help-desc">
                YouTube нь хамгийн хурдан, найдвартай, үнэгүй видео хадгалах сонголт юм.
              </p>

              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>YouTube Studio руу очих</h3>
                  <p>
                    <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer">
                      studio.youtube.com
                    </a> руу очоод "Create" → "Upload videos" дарна
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Видео upload хийх</h3>
                  <p>Видео файлаа сонгоод upload эхлүүлнэ</p>
                  <div className="important-note">
                    <strong>⚠️ Чухал:</strong> Visibility хэсгийг <strong>"Unlisted"</strong> болгох!
                    <br />
                    (Ингэснээр зөвхөн link-тэй хүмүүст харагдана)
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Embed link авах</h3>
                  <p>Upload дууссаны дараа:</p>
                  <ul>
                    <li>Видео дээрээ очино</li>
                    <li>"Share" товч дарна</li>
                    <li>"Embed" сонгоно</li>
                    <li>Дараах маягийн код харагдана:</li>
                  </ul>
                  <div className="code-block">
                    {'<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" ...>'}
                  </div>
                  <p>src="" доторх URL-г хуулна:</p>
                  <div className="code-block highlight">
                    https://www.youtube.com/embed/dQw4w9WgXcQ
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Thumbnail зураг авах</h3>
                  <p>YouTube-н VIDEO_ID ашиглаад дараах format ашиглана:</p>
                  <div className="code-block">
                    https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg
                  </div>
                  <p>Жишээ нь VIDEO_ID = dQw4w9WgXcQ бол:</p>
                  <div className="code-block highlight">
                    https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>Админ панел дээр оруулах</h3>
                  <ul>
                    <li>Админ панел руу очоод "Кино нэмэх"</li>
                    <li><strong>Видео URL:</strong> Алхам 3-с авсан embed link</li>
                    <li><strong>Зургийн URL:</strong> Алхам 4-с үүсгэсэн thumbnail URL</li>
                    <li>Бусад мэдээлэл бөглөж "Кино нэмэх" дарна</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="benefits">
              <h3>✨ YouTube ашиглах давуу тал:</h3>
              <ul>
                <li>✅ Үнэгүй, хязгааргүй storage</li>
                <li>✅ Хурдан streaming бүх дэлхий даяар</li>
                <li>✅ Автомат чанар сонголт (360p, 720p, 1080p)</li>
                <li>✅ Бүх төхөөрөмж дээр ажиллана</li>
                <li>✅ Bandwidth шаардлагагүй</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'mega' && (
          <div className="help-content">
            <div className="help-section">
              <h2>☁️ MEGA.nz ашиглан кино оруулах</h2>
              <p className="help-desc">
                MEGA.nz нь 20GB үнэгүй storage өгдөг, streaming-д тохиромжтой, хурдан үйлчилгээ юм.
              </p>

              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>MEGA.nz бүртгэл үүсгэх</h3>
                  <p>
                    <a href="https://mega.nz" target="_blank" rel="noopener noreferrer">
                      mega.nz
                    </a> руу очоод үнэгүй бүртгэл үүсгэнэ (20GB storage авна)
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Видео upload хийх</h3>
                  <p>MEGA дээр нэвтрээд видео файлаа upload хийнэ</p>
                  <div className="important-note">
                    💡 <strong>Зөвлөмж:</strong> Видеог "Cloud Drive" folder дотор байршуулна
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Share link авах</h3>
                  <p>Видео файл дээр right click → "Get link" сонгоно</p>
                  <p>MEGA-н share link ийм байх болно:</p>
                  <div className="code-block">
                    https://mega.nz/file/ABC123XYZ#def456uvw789
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Embed format руу хөрвүүлэх</h3>
                  <p>MEGA link-г streaming format руу хөрвүүлэх хэрэгтэй:</p>
                  <div className="code-block">
                    https://mega.nz/embed/FILE_ID#KEY
                  </div>
                  <p><strong>Жишээ нь:</strong></p>
                  <div className="code-block">
                    Анхны link: https://mega.nz/file/ABC123XYZ#def456uvw789
                  </div>
                  <div className="code-block highlight">
                    Embed format: https://mega.nz/embed/ABC123XYZ#def456uvw789
                  </div>
                  <p>
                    <strong>"file" үгийг "embed" болгож солиход л болно!</strong>
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h3>Админ панел дээр оруулах</h3>
                  <ul>
                    <li>Админ панел руу очоод "Кино нэмэх"</li>
                    <li><strong>Видео URL:</strong> Embed format link оруулна</li>
                    <li>Thumbnail зураг оруулна (Imgur.com г ашиглаж болно)</li>
                    <li>"Кино нэмэх" дарна</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="benefits">
              <h3>✨ MEGA.nz ашиглах давуу тал:</h3>
              <ul>
                <li>✅ 20GB үнэгүй storage</li>
                <li>✅ Хурдан download/streaming</li>
                <li>✅ End-to-end шифрлэлт (нууцлал)</li>
                <li>✅ Bandwidth асуудал бага</li>
                <li>✅ HD чанарын видео дэмждэг</li>
              </ul>
            </div>

            <div className="benefits warning">
              <h3>⚠️ MEGA.nz-н анхаарах зүйл:</h3>
              <ul>
                <li>🟡 20GB дээш хэрэгтэй бол төлбөртэй</li>
                <li>🟡 Download хязгаарлалт (үнэгүй бүртгэл: 5GB/6 цаг)</li>
                <li>🟡 YouTube шиг автомат чанар сонголт байхгүй</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="help-content">
            <div className="help-section">
              <h2>📁 Google Drive ашиглан кино оруулах</h2>
              <p className="help-desc">
                Google Drive ашиглавал 15GB хүртэл үнэгүй хадгалалт авах боломжтой.
              </p>

              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Google Drive руу очих</h3>
                  <p>
                    <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer">
                      drive.google.com
                    </a> руу очоод видео файлаа upload хийнэ
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Share хийх</h3>
                  <p>Файл дээр right click → "Share" → "Anyone with the link" сонгоно</p>
                  <div className="important-note">
                    <strong>⚠️ Чухал:</strong> "Anyone with the link" сонгох шаардлагатай!
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Link хуулах</h3>
                  <p>Google Drive-н share link ийм байх болно:</p>
                  <div className="code-block">
                    https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0/view
                  </div>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Админ панел дээр оруулах</h3>
                  <p>
                    Админ панел дээр Google Drive-н share link-г шууд "Видео URL" талбарт хуулна.
                  </p>
                  <div className="important-note">
                    💡 <strong>Автомат:</strong> Систем автоматаар embed format руу хөрвүүлнэ!
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits warning">
              <h3>⚠️ Google Drive-н хязгаарлалт:</h3>
              <ul>
                <li>🔴 Зөвхөн 15GB хүртэл үнэгүй</li>
                <li>🔴 Олон хүн нэгэн зэрэг үзвэл bandwidth дуусаж болно</li>
                <li>🔴 YouTube шиг найдвартай биш</li>
              </ul>
              <p style={{ marginTop: '16px' }}>
                <strong>Зөвлөмж:</strong> YouTube ашиглахыг зөвлөж байна!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
