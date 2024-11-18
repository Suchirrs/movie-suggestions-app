import React from 'react';
import TopBar from '../components/TopBar';

const Movies = () => {
  return (
    <div>
      <TopBar />
      <div className="main-container">
        <input type="text" placeholder="Search for a movie!" />
        <p>No movies found</p>
      </div>
    </div>
  );
};

export default Movies;
