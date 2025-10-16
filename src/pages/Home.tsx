import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import './Home.css';

interface Movie {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  is_locked: boolean;
  created_at: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const { userRole } = useAuth();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovies(data || []);
      
      // Set first movie as featured
      if (data && data.length > 0) {
        setFeaturedMovie(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const canViewMovie = (movie: Movie) => {
    if (!movie.is_locked) return true;
    return userRole === 'admin' || userRole === 'member';
  };

  if (loading) {
    return (
      <div className="home-wrapper">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-wrapper">
      <Navbar />
      
      {/* Hero Section - Featured Movie */}
      {featuredMovie && (
        <div 
          className="hero-section" 
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,10,0.95)), url(${featuredMovie.thumbnail_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{featuredMovie.title}</h1>
            <p className="hero-description">{featuredMovie.description}</p>
            <div className="hero-buttons">
              {canViewMovie(featuredMovie) ? (
                <Link to={`/movie/${featuredMovie.id}`} className="btn-play">
                  <Icon icon="mdi:play-circle" width="28" height="28" />
                  Үзэх
                </Link>
              ) : (
                <Link to="/become-member" className="btn-play">
                  <Icon icon="mdi:lock-open" width="28" height="28" />
                  Member болох
                </Link>
              )}
              {featuredMovie.is_locked && (
                <span className="hero-badge">
                  <Icon icon="mdi:crown" width="18" height="18" />
                  Member контент
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="movies-container">
        {movies.length === 0 ? (
          <div className="empty-state">
            <h2>🎬 Кино байхгүй байна</h2>
            <p>Удахгүй шинэ контент нэмэгдэнэ</p>
          </div>
        ) : (
          <>
            <div className="movie-section">
              <h2 className="section-title">Үнэгүй кино</h2>
              <div className="movies-grid">
                {movies.filter(m => !m.is_locked).map((movie) => (
                  <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card">
                    <div className="movie-poster">
                      <img src={movie.thumbnail_url} alt={movie.title} />
                    </div>
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <p>{movie.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {movies.filter(m => m.is_locked).length > 0 && (
              <div className="movie-section">
                <h2 className="section-title">
                  Member контент
                  {userRole !== 'admin' && userRole !== 'member' && (
                    <Link to="/request-membership" className="upgrade-link">Member болох</Link>
                  )}
                </h2>
                <div className="movies-grid">
                  {movies.filter(m => m.is_locked).map((movie) => {
                    const canView = canViewMovie(movie);
                    return (
                      <div key={movie.id} className="movie-card">
                        <Link to={canView ? `/movie/${movie.id}` : '/become-member'}>
                          <div className="movie-poster">
                            <img src={movie.thumbnail_url} alt={movie.title} />
                            {!canView && (
                              <div className="locked-overlay">
                                <Icon icon="mdi:lock" width="48" height="48" />
                                <p>Member эрх шаардлагатай</p>
                              </div>
                            )}
                          </div>
                        </Link>
                        <div className="movie-info">
                          <h3>{movie.title}</h3>
                          <p>{movie.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
