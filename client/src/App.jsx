import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import MoviesList from "./pages/MoviesList.jsx";

function App() {
  const location = useLocation();

  return (
    <div>
      <div>
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
        </Routes>
      </div>
    </div>
  );
}

export default App;
