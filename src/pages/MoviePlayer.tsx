import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import './MoviePlayer.css';

interface Movie {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  is_locked: boolean;
}

export default function MoviePlayer() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async (movieId: string) => {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .single();

        if (error) throw error;
        
        console.log('🎬 Movie data:', data);
        console.log('🎥 Video URL:', data.video_url);
        
        // Check if user can view this movie
        if (data.is_locked && userRole !== 'admin' && userRole !== 'member') {
          alert('Та энэ киног үзэх эрхгүй байна. Member эрх шаардлагатай.');
          navigate('/');
          return;
        }

        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie(id);
    }
  }, [id, userRole, navigate]);

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

  if (!movie) {
    return (
      <div>
        <Navbar />
        <div className="error-container">
          <p>Кино олдсонгүй</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="movie-player-container">
        <div className="video-wrapper">
          {movie.video_url.includes('mega.nz') ? (
            // MEGA.nz-ын тусгай тохиргоо
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
              <iframe
                src={movie.video_url}
                title={movie.title}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : (
            // Бусад video платформууд (YouTube, Google Drive)
            <iframe
              src={movie.video_url}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="video-player"
            />
          )}
        </div>
        
        <div className="movie-details">
          <h1>{movie.title}</h1>
          <p className="movie-description">{movie.description}</p>
          {movie.is_locked && (
            <div className="locked-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Member контент
            </div>
          )}
        </div>

        <button onClick={() => navigate('/')} className="btn-back">
          ← Буцах
        </button>
      </div>
    </div>
  );
}
