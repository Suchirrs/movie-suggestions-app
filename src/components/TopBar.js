import React from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.topbar}>
      <div style={styles.leftButtons}>
        <button onClick={() => navigate("/profile")} style={styles.button}>
          Profile
        </button>
        <button onClick={() => navigate("/suggestions")} style={styles.button}>
          Suggestions
        </button>
        <button onClick={() => navigate("/movies")} style={styles.button}>
          Movies
        </button>
      </div>
      <button onClick={() => navigate("/")} style={styles.rightButton}>
        Sign Out
      </button>
    </div>
  );
};

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-between", // Spread out buttons
    alignItems: "center",
    backgroundColor: "#D32F2F", // Red background
    padding: "10px 20px", // Adjust padding for spacing
    borderBottom: "2px solid #B71C1C", // Slightly darker red border
  },
  leftButtons: {
    display: "flex",
    gap: "10px", // Space between the buttons
  },
  button: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF", // White text
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  rightButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#FFFFFF", // White text
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default TopBar;
