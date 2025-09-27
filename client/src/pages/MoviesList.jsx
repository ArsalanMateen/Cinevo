import React, { useState, useEffect, useCallback } from "react";

import { Star } from "lucide-react";

import MovieDataService from "../services/movies.js";
import illustration from "../assets/images/illustration.png";
import noMoviePoster from "../assets/images/poster.png";
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

      <div className={styles.grid}>
        {movies.map((movie) => (
          <div className={styles.card} key={movie._id}>
            <div className={styles.cardLink}>
              <div className={styles.posterWrapper}>
                <img
                  className={styles.poster}
                  src={movie.poster || noMoviePoster}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noMoviePoster;
                  }}
                />
              </div>
              <div className={styles.cardBody}>
                <h5 className={styles.movieTitle}>{movie.title}</h5>
                <div className={styles.movieMeta}>
                  <span className={styles.movieYear}>{movie.year}</span>
                </div>
                {movie.genres && (
                  <div className={styles.movieGenres}>
                    {movie.genres.join(", ")}
                  </div>
                )}
                <p className={styles.moviePlot}>
                  {movie.plot || "No plot available."}
                </p>
                {movie.imdb && movie.imdb.rating > 0 && (
                  <div className={styles.rating}>
                    <Star
                      size={14}
                      className={styles.ratingStar}
                      fill="var(--color-star)"
                      color="var(--color-star)"
                    />
                    <span className={styles.ratingValue}>
                      {movie.imdb.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default MoviesList;
