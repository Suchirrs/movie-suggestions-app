import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filterBy, setFilterBy] = useState(''); // First dropdown (Genre/Director)
  const [filterValue, setFilterValue] = useState(''); // Second dropdown value
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [page, setPage] = useState(1); // Tracks the current page for lazy loading
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const moviesPerPage = 12; // Number of movies to load per page

  useEffect(() => {
    // Fetch movies data from the backend
    const fetchMovies = () => {
      let endpoint = 'http://localhost:5000/movies';
      const params = {};

      if (filterBy === 'Genre' && filterValue) {
        endpoint = 'http://localhost:5000/movies/genre';
        params.genre = filterValue;
      } else if (filterBy === 'Director' && filterValue) {
        endpoint = 'http://localhost:5000/movies/director';
        params.director = filterValue;
      }

      axios
        .get(endpoint, { params })
        .then((response) => {
          setMovies(response.data);
          setVisibleMovies([]);
          setPage(1); // Reset page for lazy loading
        })
        .catch((error) => {
          console.error('Error fetching movies:', error);
        });
    };

    fetchMovies();
  }, [filterBy, filterValue]);

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

  // Get unique values for the second dropdown based on the selected filter
  const getUniqueFilterValues = () => {
    if (filterBy === 'Genre') {
      // Extract unique genres
      return Array.from(
        new Set(
          movies.flatMap((movie) =>
            movie.genres
              ? movie.genres.split(',').map((genre) => genre.trim())
              : []
          )
        )
      );
    } else if (filterBy === 'Director') {
      return Array.from(new Set(movies.map((movie) => movie.Director).filter(Boolean)));
    }
    return [];
  };

  // Filter movies based on the selected filter and value
  const filteredMovies = visibleMovies.filter((movie) => {
    if (!filterBy || !filterValue) return true; // No filter applied

    if (filterBy === 'Genre') {
      if (!movie.genres) return false; // No genres in the movie
      const genresArray = movie.genres.split(',').map((genre) => genre.trim());
      return genresArray.includes(filterValue); // Check if the genre matches
    }

    if (filterBy === 'Director') {
      return (
        movie.Director &&
        movie.Director.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return true;
  });

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
        {/* Filter Bars */}
        <div style={styles.filterContainer}>
          <select
            style={styles.filterDropdown}
            value={filterBy}
            onChange={(e) => {
              setFilterBy(e.target.value);
              setFilterValue(''); // Reset the second dropdown
            }}
          >
            <option value="">Filter by</option>
            <option value="Genre">Genre</option>
            <option value="Director">Director</option>
          </select>

          {filterBy && (
            <select
              style={styles.filterDropdown}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">Select {filterBy}</option>
              {getUniqueFilterValues().map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Movies List */}
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
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px',
  },
  filterDropdown: {
    padding: '10px',
    fontSize: '16px',
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
