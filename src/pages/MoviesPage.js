import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [page, setPage] = useState(1); // Tracks the current page for lazy loading
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const moviesPerPage = 12; // Number of movies to load per page

  useEffect(() => {
    // Fetch movies data from the backend
    axios
      .get('http://localhost:5000/movies')
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  useEffect(() => {
    // Load initial movies
    loadMoreMovies();
  }, [movies]);

  const loadMoreMovies = () => {
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const nextBatch = movies.slice(startIndex, endIndex);
    setVisibleMovies((prev) => [...prev, ...nextBatch]);
    setPage((prev) => prev + 1);
  };

  // Filtered and visible movies based on search term
  const filteredMovies = visibleMovies.filter((movie) =>
    movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lastMovieRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && movies.length > visibleMovies.length) {
          loadMoreMovies(); // Load more movies when the last item is in view
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [movies, visibleMovies]
  );

  return (
    <div style={styles.pageContainer}>
      <TopBar />
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>Movies</h1>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for a movie!"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.movieListContainer}>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie, index) => {
              const isLastMovie = index === filteredMovies.length - 1;
              return (
                <div
                  key={index}
                  style={styles.movieCard}
                  ref={isLastMovie ? lastMovieRef : null}
                  onClick={() => navigate(`/movies/${movie.id}`, { state: { movie } })}
                >
                  <h2 style={styles.movieTitle}>{movie.Title}</h2>
                  <p style={styles.movieRating}>⭐ {movie.averageRating}</p>
                </div>
              );
            })
          ) : (
            <p style={styles.noMoviesText}>No movies found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#212121',
    color: 'white',
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    overflow: 'hidden',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '50%',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: '#333',
    color: 'white',
  },
  movieListContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '10px',
  },
  movieCard: {
    backgroundColor: '#b71c1c',
    color: 'white',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s',
  },
  movieTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  movieRating: {
    fontSize: '16px',
    color: 'white',
  },
  noMoviesText: {
    gridColumn: 'span 4',
    textAlign: 'center',
  },
};

export default Movies;
