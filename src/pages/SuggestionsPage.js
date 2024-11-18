import React from 'react';
import TopBar from '../components/TopBar';

const Suggestions = ({ name }) => {
  return (
    <div>
      <TopBar />
      <div className="main-container">
        <h2>Suggesting movies for {name || 'Guest'}</h2>
        <input type="text" placeholder="Search for a movie!" />
        <p>No data to create suggestions</p>
      </div>
    </div>
  );
};

export default Suggestions;
