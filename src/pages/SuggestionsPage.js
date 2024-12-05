import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import TopBar from '../components/TopBar';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Suggestions = () => {
  const { userID } = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const moviesPerPage = 12; // Number of movies to load per page

  useEffect(() => {
    if (userID) {
      // Fetch suggestions from the backend
      axios
        .get(`http://localhost:5000/suggestions/${userID}`)
        .then((response) => {
          setMovies(response.data);
          setVisibleMovies([]);
          setPage(1); // Reset page for lazy loading
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    }
  }, [userID]);

  useEffect(() => {
    // Load initial suggestions
    loadMoreMovies();
  }, [movies]);

  const loadMoreMovies = () => {
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const nextBatch = movies.slice(startIndex, endIndex);
    setVisibleMovies((prev) => [...prev, ...nextBatch]);
    setPage((prev) => prev + 1);
  };

  const lastMovieRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && movies.length > visibleMovies.length) {
          loadMoreMovies(); // Load more suggestions when the last item is in view
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
        <h1 style={styles.heading}>Movie Suggestions</h1>
        <h2 style={styles.subheading}>For {userID || 'Guest'}</h2>
        <div style={styles.movieListContainer}>
          {visibleMovies.length > 0 ? (
            visibleMovies.map((movie, index) => {
              const isLastMovie = index === visibleMovies.length - 1;
              return (
                <div
                  key={index}
                  style={styles.movieCard}
                  ref={isLastMovie ? lastMovieRef : null}
                  onClick={() =>
                    navigate(`/movies/${movie.tconst}`, { state: { movie } })
                  }
                >
                  <h2 style={styles.movieTitle}>{movie.title}</h2>
                  <p style={styles.movieRating}>⭐ {movie.averageRating}</p>
                  <p style={styles.movieYear}>{movie.Year}</p>
                  <p style={styles.movieGenres}>{movie.genres}</p>
                </div>
              );
            })
          ) : (
            <p style={styles.noMoviesText}>
              {userID ? 'No suggestions available.' : 'Please log in to see suggestions.'}
            </p>
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
    marginBottom: '10px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '24px',
    fontWeight: 'normal',
    marginBottom: '20px',
    textAlign: 'center',
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
  movieYear: {
    fontSize: '14px',
    color: '#ddd',
  },
  movieGenres: {
    fontSize: '14px',
    color: '#bbb',
  },
  noMoviesText: {
    gridColumn: 'span 4',
    textAlign: 'center',
    color: '#bbb',
  },
};

export default Suggestions;
