import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/main.css";
import styles from "./App.module.css";

import Sidebar from "./components/Sidebar.jsx";
import MoviesList from "./pages/MoviesList.jsx";
import Movie from "./pages/Movie.jsx";
import Login from "./pages/Login.jsx";

function App() {
  const location = useLocation();
  const [user, setUser] = React.useState(() => {
    try {
      const savedUser = localStorage.getItem("cinevo_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  async function login(userData = null) {
    setUser(userData);
    if (userData) {
      localStorage.setItem("cinevo_user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("cinevo_user");
    }
  }

  async function logout() {
    setUser(null);
    localStorage.removeItem("cinevo_user");
  }

  return (
    <div className={styles.app}>
      <Sidebar user={user} logout={logout} />
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
          <Route path="/movies/:id" element={<Movie user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
