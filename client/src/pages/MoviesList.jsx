import React, { useState, useEffect, useCallback } from "react";

import MovieDataService from "../services/movies.js";
import illustration from "../assets/images/illustration.png";
import styles from "./MoviesList.module.css";

const MoviesList = () => {

  const sort = "year:desc";

  const currentPage = 0;

  const [movies, setMovies] = useState([]);

  const [totalResults, setTotalResults] = useState(0);
  const moviesPerPage = 20;

  useEffect(() => {
    document.title = "Cinevo";
  }, []);

  const retrieveMovies = useCallback(() => {
    MovieDataService.getAll(currentPage, sort, moviesPerPage)
      .then((response) => {
        setMovies(response?.data?.moviesList || []);
        setTotalResults(response?.data?.totalMovies || 0);
      })
      .catch((e) => {
        console.error("Error retrieving movies:", e);
      });
  }, [currentPage, sort, moviesPerPage]);

  useEffect(() => { retrieveMovies(); }, [retrieveMovies]);

  const startResult = totalResults === 0 ? 0 : currentPage * moviesPerPage + 1;
  const endResult = Math.min((currentPage + 1) * moviesPerPage, totalResults);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Movies</h1>
          <p className={styles.headerSubtitle}>
            Discover, rate, and review the best movies.
          </p>
        </div>
        <img
          src={illustration}
          alt="Cinema"
          className={styles.headerIllustration}
        />
      </div>

      <div className={styles.resultsInfo}>
        <span className={styles.resultsText}>
          Showing {startResult}-{endResult} of {totalResults.toLocaleString()}
        </span>
      </div>

      <ul>{movies.map((movie) => <li key={movie._id}>{movie.title}</li>)}</ul>
    </div>
  );
};

export default MoviesList;
