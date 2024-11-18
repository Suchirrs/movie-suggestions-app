import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.topbar}>
      <button onClick={() => navigate("/suggestions")} style={styles.button}>
        Suggestions
      </button>
      <button onClick={() => navigate("/movies")} style={styles.button}>
        Movies
      </button>
    </div>
  );
};

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#D32F2F", // Red background
    padding: "10px 0",
    borderBottom: "2px solid #B71C1C", // Slightly darker red border
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF", // White text
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default TopBar;
