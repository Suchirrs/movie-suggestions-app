import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";

const Profile = () => {
  const navigate = useNavigate();

  // Mock data for the profile
  const ratedMovies = [
    { title: "Inception", rating: 4.5 },
    { title: "The Dark Knight", rating: 5 },
    { title: "Interstellar", rating: 4 },
  ];

  const favoriteMovies = [
    "The Matrix",
    "The Shawshank Redemption",
    "The Godfather",
  ];

  return (
    <div>
      <TopBar />
      <div className="main-container">
        <h2>Your Profile</h2>
        <div className="profile-section">
          <h3>Movies Rated</h3>
          <ul>
            {ratedMovies.map((movie, index) => (
              <li key={index}>
                {movie.title} - {movie.rating} / 5
              </li>
            ))}
          </ul>
        </div>
        <div className="profile-section">
          <h3>Favorite Movies</h3>
          <ul>
            {favoriteMovies.map((movie, index) => (
              <li key={index}>{movie}</li>
            ))}
          </ul>
        </div>
        <button onClick={() => navigate("/signout")} className="sign-out-button">
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
