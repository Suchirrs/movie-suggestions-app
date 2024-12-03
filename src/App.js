import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignInPage';
import Suggestions from './pages/SuggestionsPage';
import Movies from './pages/MoviesPage';
import Profile from './pages/ProfilePage';
import MovieDetail from './pages/MovieDetail';

function App() {
  const [name, setName] = useState('Guest');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn setName={setName} />} />
        <Route path="/suggestions" element={<Suggestions name={name} />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;
