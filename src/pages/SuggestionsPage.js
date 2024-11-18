import React, { useState, useContext } from "react";
import TopBar from "../components/TopBar";
import { UserContext } from "../UserContext";

const SuggestionsPage = () => {
  const [data] = useState([]); // Placeholder for suggestions, currently empty
  const [searchQuery, setSearchQuery] = useState("");
  const { name } = useContext(UserContext); // Access context

  return (
    <div style={styles.container}>
      <TopBar />
      <div style={styles.content}>
        <h2 style={styles.title}>Suggesting movies for {name || "Guest"}</h2>
        <input
          type="text"
          placeholder="Search for a movie!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        {data.length === 0 ? (
          <p style={styles.message}>No data to create suggestions</p>
        ) : (
          <ul style={styles.list}>
            {data.map((item, index) => (
              <li key={index} style={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#212121",
    minHeight: "100vh",
    color: "#FFFFFF",
  },
  content: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#FFFFFF",
  },
  searchBar: {
    padding: "10px",
    width: "80%",
    maxWidth: "500px",
    fontSize: "16px",
    margin: "10px 0 20px 0",
    borderRadius: "10px",
    border: "1px solid #D32F2F",
    backgroundColor: "#424242",
    color: "#FFFFFF",
  },
  message: {
    color: "#FFCDD2",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    padding: "10px",
    backgroundColor: "#424242",
    marginBottom: "10px",
    borderRadius: "5px",
  },
};

export default SuggestionsPage;
