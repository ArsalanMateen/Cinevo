import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import MovieDataService from "../services/movies.js";
import BackLink from "../components/ui/BackLink.jsx";
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
        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>

          <p className={styles.plot}>{movie.fullplot || movie.plot || "No plot available."}</p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
