import React from 'react';
import TopBar from '../components/TopBar';

const Suggestions = ({ name }) => {
  return (
    <div>
      <TopBar />
      <div className="main-container" style={styles.container}>
        <h1 style={styles.heading}>Movie Suggestions</h1>
        <h2 style={styles.subheading}>For {name || 'Guest'}</h2>
        <input type="text" placeholder="Search for a movie!" style={styles.input} />
        <p>No data to create suggestions</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    marginTop: "10px", // Reduced margin-top to decrease space between TopBar and heading
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "5px", // Reduced margin-bottom to make it closer to the subheading
  },
  subheading: {
    fontSize: "24px",
    fontWeight: "normal",
    marginBottom: "20px", // Space between subheading and search box
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    width: "80%",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  }
};

export default Suggestions;
