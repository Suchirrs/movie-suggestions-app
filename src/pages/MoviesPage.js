import React, { useState, useContext } from "react";
import TopBar from "../components/TopBar";
import { UserContext } from "../UserContext";

const MoviesPage = () => {
  const [movies] = useState([]); // Placeholder for movies
  const [searchQuery, setSearchQuery] = useState("");
  const { name } = useContext(UserContext); // Access context

  return (
    <div style={styles.container}>
      <TopBar />
      <div style={styles.content}>
        <h2 style={styles.title}>Welcome {name || "Guest"} to Movies</h2>
        <input
          type="text"
          placeholder="Search for a movie!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        {movies.length === 0 ? (
          <p style={styles.message}>No movies found</p>
        ) : (
          <ul style={styles.list}>
            {movies.map((movie, index) => (
              <li key={index} style={styles.listItem}>
                {movie}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = { /* Styles remain the same */ };

export default MoviesPage;
