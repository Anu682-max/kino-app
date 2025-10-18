import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import './Admin.css';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'user';
  created_at: string;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  is_locked: boolean;
  created_at: string;
}

export default function Admin() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'movies' | 'users'>('movies');

  // New movie form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userRole !== 'admin') {
      alert('Та админ эрхгүй байна!');
      navigate('/');
      return;
    }
    fetchData();
  }, [userRole, navigate]);

  const fetchData = async () => {
    try {
      const [moviesData, usersData] = await Promise.all([
        supabase.from('movies').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*').order('created_at', { ascending: false }),
      ]);

      if (moviesData.data) setMovies(moviesData.data);
      if (usersData.data) setUsers(usersData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Файлын нэр үүсгэх: timestamp + random number + extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      // Supabase Storage руу upload хийх
      const { error: uploadError } = await supabase.storage
        .from('movie-thumbnails')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Public URL авах
      const { data: { publicUrl } } = supabase.storage
        .from('movie-thumbnails')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Зураг upload хийхэд алдаа гарлаа!');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;

      // Хэрэв файл сонгосон бол upload хийх
      if (thumbnailFile) {
        const uploadedUrl = await handleThumbnailUpload(thumbnailFile);
        if (!uploadedUrl) {
          setSubmitting(false);
          return;
        }
        finalThumbnailUrl = uploadedUrl;
      }

      const { error } = await supabase.from('movies').insert({
        title,
        description,
        video_url: videoUrl,
        thumbnail_url: finalThumbnailUrl,
        is_locked: isLocked,
      });

      if (error) throw error;

      alert('Кино амжилттай нэмэгдлээ!');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
      setThumbnailFile(null);
      setIsLocked(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert('Алдаа гарлаа!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMovie = async (id: string) => {
    if (!confirm('Энэ киног устгах уу?')) return;

    try {
      console.log('Deleting movie with ID:', id); // Debug log
      
      const { data, error } = await supabase
        .from('movies')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Deleted movie:', data); // Debug log
      alert('Кино амжилттай устгагдлаа!');
      fetchData();
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert(`Кино устгахад алдаа гарлаа: ${error instanceof Error ? error.message : 'Тодорхойгүй алдаа'}`);
    }
  };

  const handleToggleLock = async (id: string, currentLockState: boolean) => {
    try {
      const { error } = await supabase
        .from('movies')
        .update({ is_locked: !currentLockState })
        .eq('id', id);

      if (error) throw error;
      alert(`Кино төлөв ${!currentLockState ? 'Locked' : 'Free'} болж өөрчлөгдлөө!`);
      fetchData();
    } catch (error) {
      console.error('Error toggling lock:', error);
      alert('Төлөв өөрчлөхөд алдаа гарлаа');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'member' | 'user') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      alert('Хэрэглэгчийн эрх амжилттай шинэчлэгдлээ!');
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Эрх шинэчлэхэд алдаа гарлаа');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">
          <Icon icon="mdi:shield-crown" style={{ marginRight: '10px' }} />
          Админ панел
        </h1>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            Кино удирдах ({movies.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Хэрэглэгчид ({users.length})
          </button>
        </div>

        {activeTab === 'movies' && (
          <div className="admin-section">
            <div className="add-movie-form">
              <h2>Кино нэмэх</h2>
              <form onSubmit={handleAddMovie}>
                <div className="form-group">
                  <label>Киноны нэр</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Жишээ: Avengers"
                  />
                </div>
                <div className="form-group">
                  <label>Тайлбар</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Киноны товч тайлбар"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Видео URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      let url = e.target.value.trim();
                      
                      // Хэрэв iframe tag бүхэлдээ хуулсан бол src-г нь салгаж авна
                      if (url.includes('<iframe') && url.includes('src=')) {
                        const srcMatch = url.match(/src=["']([^"']+)["']/);
                        if (srcMatch) {
                          url = srcMatch[1];
                        }
                      }
                      
                      // Google Drive link-г автоматаар embed format руу хөрвүүлнэ
                      if (url.includes('drive.google.com/file/d/')) {
                        const match = url.match(/\/file\/d\/([^/]+)/);
                        if (match) {
                          url = `https://drive.google.com/file/d/${match[1]}/preview`;
                        }
                      }
                      
                      // MEGA.nz file link-г автоматаар embed format руу хөрвүүлнэ
                      if (url.includes('mega.nz/file/')) {
                        url = url.replace('/file/', '/embed/');
                      }
                      
                      setVideoUrl(url);
                    }}
                    required
                    placeholder="YouTube, MEGA.nz эсвэл Google Drive link (iframe tag хуулж болно)"
                  />
                  <small style={{ color: '#666', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                    💡 YouTube embed, MEGA.nz embed код/link эсвэл Google Drive share link оруулна уу
                  </small>
                </div>
                <div className="form-group">
                  <label>Зураг (Thumbnail)</label>
                  
                  {/* File Upload Option */}
                  <div style={{ marginBottom: '15px' }}>
                    <label 
                      htmlFor="thumbnail-upload" 
                      style={{ 
                        display: 'inline-block',
                        padding: '10px 20px',
                        background: '#667eea',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#5a67d8'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#667eea'}
                    >
                      📁 Зураг Upload хийх
                    </label>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setThumbnailFile(file);
                          setThumbnailUrl(''); // URL-г цэвэрлэх
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                    {thumbnailFile && (
                      <div style={{ 
                        marginTop: '10px', 
                        color: '#48bb78',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        ✅ {thumbnailFile.name}
                        <button
                          type="button"
                          onClick={() => setThumbnailFile(null)}
                          style={{
                            background: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* URL Option */}
                  <div style={{ marginTop: '10px' }}>
                    <label style={{ fontSize: '14px', color: '#718096', marginBottom: '8px', display: 'block' }}>
                      Эсвэл URL оруулах:
                    </label>
                    <input
                      type="url"
                      value={thumbnailUrl}
                      onChange={(e) => {
                        setThumbnailUrl(e.target.value);
                        if (e.target.value) {
                          setThumbnailFile(null); // Файлыг цэвэрлэх
                        }
                      }}
                      disabled={!!thumbnailFile}
                      placeholder="https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg"
                      style={{
                        opacity: thumbnailFile ? 0.5 : 1,
                        cursor: thumbnailFile ? 'not-allowed' : 'text'
                      }}
                    />
                    <small style={{ color: '#666', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                      💡 YouTube thumbnail: https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg
                    </small>
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isLocked}
                      onChange={(e) => setIsLocked(e.target.checked)}
                    />
                    <span>Locked (Member-т зориулсан)</span>
                  </label>
                </div>
                <button type="submit" disabled={submitting || uploading} className="btn-submit">
                  {uploading ? (
                    <>
                      <Icon icon="mdi:cloud-upload" width="20" className="spin-icon" />
                      Зураг upload хийж байна...
                    </>
                  ) : submitting ? (
                    <>
                      <Icon icon="mdi:loading" width="20" className="spin-icon" />
                      Нэмж байна...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:plus-circle" width="20" />
                      Кино нэмэх
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="movies-list">
              <h2>Кино жагсаалт</h2>
              {movies.length === 0 ? (
                <p className="empty-message">Кино байхгүй байна</p>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Нэр</th>
                        <th>Төлөв</th>
                        <th>Огноо</th>
                        <th>Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map((movie) => (
                        <tr key={movie.id}>
                          <td>
                            <div className="movie-cell">
                              <img 
                                src={movie.thumbnail_url} 
                                alt={movie.title}
                                className="movie-thumb"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60';
                                }}
                              />
                              <span>{movie.title}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${movie.is_locked ? 'locked' : 'free'}`}>
                              {movie.is_locked ? (
                                <>
                                  <Icon icon="mdi:lock" width="16" />
                                  Locked
                                </>
                              ) : (
                                <>
                                  <Icon icon="mdi:earth" width="16" />
                                  Free
                                </>
                              )}
                            </span>
                          </td>
                          <td>{new Date(movie.created_at).toLocaleDateString('mn-MN')}</td>
                          <td>
                            <button
                              onClick={() => handleToggleLock(movie.id, movie.is_locked)}
                              className={`btn-toggle ${movie.is_locked ? 'unlock' : 'lock'}`}
                              style={{ marginRight: '10px' }}
                            >
                              {movie.is_locked ? (
                                <>
                                  <Icon icon="mdi:lock-open" width="16" />
                                  Нээх
                                </>
                              ) : (
                                <>
                                  <Icon icon="mdi:lock" width="16" />
                                  Түгжих
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie.id)}
                              className="btn-delete"
                            >
                              <Icon icon="mdi:delete" width="16" />
                              Устгах
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>Хэрэглэгчдийн жагсаалт</h2>
            {users.length === 0 ? (
              <p className="empty-message">Хэрэглэгч байхгүй байна</p>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Имэйл</th>
                      <th>Эрх</th>
                      <th>Бүртгэлийн огноо</th>
                      <th>Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge role-${user.role}`}>
                            {user.role === 'admin' ? (
                              <>
                                <Icon icon="mdi:shield-crown" width="16" />
                                Админ
                              </>
                            ) : user.role === 'member' ? (
                              <>
                                <Icon icon="mdi:star" width="16" />
                                Member
                              </>
                            ) : (
                              <>
                                <Icon icon="mdi:account" width="16" />
                                Хэрэглэгч
                              </>
                            )}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString('mn-MN')}</td>
                        <td>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as 'admin' | 'member' | 'user')}
                            className="role-select"
                          >
                            <option value="user">Хэрэглэгч</option>
                            <option value="member">Member</option>
                            <option value="admin">Админ</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
