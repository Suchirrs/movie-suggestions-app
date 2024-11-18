import React from 'react';
import TopBar from '../components/TopBar';

const Movies = () => {
  return (
    <div>
      <TopBar />
      <div className="main-container">
      <h1 style={styles.heading}>Movies</h1>
        <input type="text" placeholder="Search for a movie!" />
        <p>No movies found</p>
      </div>
    </div>
  );
};

const styles = { 
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "5px", // Reduced margin-bottom to make it closer to the subheading
  }
};

export default Movies;
