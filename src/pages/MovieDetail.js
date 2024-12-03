import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {}; // Get the movie details passed via state
  const [rating, setRating] = useState(0); // For the user's rating

  if (!movie) {
    return (
      <div style={styles.overlay}>
        <div style={styles.popup}>
          <p style={styles.errorText}>Movie not found!</p>
          <button style={styles.closeButton} onClick={() => navigate(-1)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleRatingChange = (e) => {
    const value = Math.min(10, Math.max(0, Number(e.target.value))); // Limit rating to 0-10
    setRating(value);
  };

  const handleClose = () => {
    navigate(-1); // Close popup and navigate back
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h1 style={styles.title}>{movie.Title}</h1>
        <p style={styles.text}>
          <strong>Director:</strong> {movie.Director || 'Unknown'}
        </p>
        <p style={styles.text}>
          <strong>Genres:</strong> {movie.genres || 'Unknown'}
        </p>
        <p style={styles.text}>
          <strong>Release Year:</strong> {movie.releaseYear || 'Unknown'}
        </p>
        <p style={styles.text}>
          <strong>Average Rating:</strong> {movie.averageRating || 'N/A'}
        </p>

        <div style={styles.ratingContainer}>
          <label style={styles.ratingLabel}>
            Rate this movie (out of 10):
            <input
              type="number"
              value={rating}
              onChange={handleRatingChange}
              style={styles.ratingInput}
              max="10"
              min="0"
            />
          </label>
        </div>

        <button style={styles.closeButton} onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: '#b71c1c',
    color: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    margin: '10px 0',
  },
  ratingContainer: {
    marginTop: '20px',
  },
  ratingLabel: {
    fontSize: '16px',
    marginBottom: '10px',
    display: 'block',
  },
  ratingInput: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginTop: '10px',
  },
  closeButton: {
    backgroundColor: '#212121',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  errorText: {
    fontSize: '18px',
    color: 'white',
    marginBottom: '20px',
  },
};

export default MovieDetail;
