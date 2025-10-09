import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/main.css";
import styles from "./App.module.css";

import Sidebar from "./components/Sidebar.jsx";
import MoviesList from "./pages/MoviesList.jsx";
import Movie from "./pages/Movie.jsx";

function App() {
  const location = useLocation();

  return (
    <div className={styles.app}>
      <Sidebar />
      <div className={styles.appMain}>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={{ pathname: "/movies", search: location.search }}
                replace
              />
            }
          />
          <Route path="/movies" element={<MoviesList />} />
          <Route
            path="/movies/top-rated"
            element={<MoviesList defaultSort="rating:desc" />}
          />
          <Route
            path="/movies/award-winners"
            element={<MoviesList defaultSort="awards:desc" />}
          />
          <Route
            path="/movies/most-discussed"
            element={<MoviesList defaultSort="comments:desc" />}
          />
          <Route path="/movies/:id" element={<Movie />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
