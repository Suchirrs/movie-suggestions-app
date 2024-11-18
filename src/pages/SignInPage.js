import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const SignInPage = () => {
  const [error, setError] = useState(false);
  const { name, setName } = useContext(UserContext); // Access context
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (!name.trim()) {
      setError(true);
    } else {
      setError(false);
      navigate("/suggestions"); // Navigate to Suggestions page
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update context
          style={styles.input}
        />
        <button onClick={handleButtonClick} style={styles.button}>
          Give me my suggestions!
        </button>
        {error && <p style={styles.error}>Please enter a name!</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#212121",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    textAlign: "center",
  },
  input: {
    padding: "10px",
    width: "300px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #D32F2F",
    backgroundColor: "#424242",
    color: "#FFFFFF",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#D32F2F",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  error: {
    color: "#FFCDD2",
    marginTop: "10px",
  },
};

export default SignInPage;
