import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

import MovieDataService from "../services/movies.js";
import BackLink from "../components/ui/BackLink.jsx";
import noMoviePoster from "../assets/images/poster.png";
import styles from "./Movie.module.css";

const Movie = (props) => {
  const { id } = useParams();

  const [movie, setMovie] = useState({
    _id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  const getMovie = (id) => {
    MovieDataService.get(id)
      .then((response) => {
        setMovie(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getMovie(id);
  }, [id]);

  useEffect(() => {
    if (movie && movie.title) {
      document.title = movie.title;
    } else {
      document.title = "Movie Details";
    }
  }, [movie]);

  return (
    <div className={styles.movieDetail}>
      <BackLink to="/" />

      <div className={styles.header}>
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

        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>

          <div className={styles.meta}>
            {movie.year && (
              <span className={styles.year}>
                <Calendar
                  size={13}
                  style={{ verticalAlign: "-1px", marginRight: "4px" }}
                />
                {movie.year}
              </span>
            )}

            {movie.runtime && (
              <span className={styles.runtime}>
                <Clock
                  size={13}
                  style={{ verticalAlign: "-1px", marginRight: "4px" }}
                />
                {movie.runtime} min
              </span>
            )}
          </div>

          {movie.genres && (
            <div className={styles.genres}>
              {movie.genres.map((genre, i) => (
                <span key={i} className={styles.genreTag}>
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className={styles.plot}>{movie.fullplot || movie.plot || "No plot available."}</p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
