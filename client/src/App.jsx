import React from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/main.css";
import styles from "./App.module.css";

import MoviesList from "./pages/MoviesList.jsx";
import Movie from "./pages/Movie.jsx";

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.appMain}>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" replace />} />
          <Route path="/movies" element={<MoviesList />} />
          <Route path="/movies/:id" element={<Movie />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
