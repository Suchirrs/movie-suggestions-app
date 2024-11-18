import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import MoviesPage from "./pages/MoviesPage"; // Import Movies Page

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/movies" element={<MoviesPage />} /> {/* Add route for Movies */}
      </Routes>
  );
};

export default App;
