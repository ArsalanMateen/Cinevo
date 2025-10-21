import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Edit3, Trash2, Clock, Calendar, User, Send } from "lucide-react";

import MovieDataService from "../services/movies.js";
import BackLink from "../components/ui/BackLink.jsx";
import noMoviePoster from "../assets/images/poster.png";
import styles from "./Movie.module.css";

const reviewDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const Movie = (props) => {
  const { id } = useParams();

  const [movie, setMovie] = useState({
    _id: null,
    title: "",
    rated: "",
    reviews: [],
  });

  const [isPlotExpanded, setIsPlotExpanded] = useState(false);
  const [canExpandPlot, setCanExpandPlot] = useState(false);

  const plotRef = useRef(null);

  const [newReviewText, setNewReviewText] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const data = {
      review: newReviewText.trim(),
      name: props.user.name,
      email: props.user.email,
      user_id: props.user._id,
      movie_id: id,
    };

    MovieDataService.createReview(data)
      .then(() => {
        getMovie(id);
        setNewReviewText("");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteReview = (reviewId) => {
    MovieDataService.deleteReview(reviewId, props.user?._id)
      .then(() => {
        setMovie((prevState) => ({
          ...prevState,
          reviews: prevState.reviews.filter((r) => r._id !== reviewId),
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getMovie = (id) => {
    MovieDataService.get(id)
      .then((response) => {
        if (response.data && Array.isArray(response.data.reviews)) {
          response.data.reviews.sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
          );
        }
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
      document.title = `${movie.title} | Cinevo`;
    } else {
      document.title = "Movie Details | Cinevo";
    }
  }, [movie]);

  useEffect(() => {
    setIsPlotExpanded(false);
    setCanExpandPlot(false);

    const checkOverflow = () => {
      if (plotRef.current) {
        const hasOverflow =
          plotRef.current.scrollHeight > plotRef.current.clientHeight + 2;
        if (hasOverflow) {
          setCanExpandPlot(true);
        }
      }
    };

    const timer = setTimeout(checkOverflow, 50);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkOverflow);
    };
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

          <div className={styles.plotWrapper}>
            <p
              ref={plotRef}
              className={`${styles.plot} ${
                isPlotExpanded ? styles.plotExpanded : ""
              }`}
            >
              {movie.fullplot || movie.plot || "No plot available."}
            </p>
            {canExpandPlot && (
              <button
                type="button"
                className={styles.plotToggle}
                onClick={() => setIsPlotExpanded(!isPlotExpanded)}
              >
                {isPlotExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          <div className={styles.stats}>
            {movie.imdb && movie.imdb.rating > 0 && (
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  <Star
                    size={18}
                    fill="var(--color-star)"
                    color="var(--color-star)"
                  />
                  <span>{movie.imdb.rating}</span>
                </div>
                <div className={styles.statLabel}>IMDb Rating</div>
              </div>
            )}
            {movie.imdb && movie.imdb.votes > 0 && (
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {movie.imdb.votes.toLocaleString()}
                </div>
                <div className={styles.statLabel}>Votes</div>
              </div>
            )}
          </div>

          {movie.cast && movie.cast.length > 0 && (
            <div className={styles.cast}>
              <div className={styles.castTitle}>Cast</div>

              <div className={styles.castList}>
                {movie.cast.slice(0, 6).join(", ")}
              </div>
            </div>
          )}

          {movie.directors && movie.directors.length > 0 && (
            <div className={styles.cast}>
              <div className={styles.castTitle}>
                {movie.directors.length > 1 ? "Directors" : "Director"}
              </div>

              <div className={styles.castList}>
                {movie.directors.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsTitle}>
            Reviews ({movie.reviews ? movie.reviews.length : 0})
          </h2>
        </div>

        {props.user ? (
          <form
            id="review-composer"
            className={styles.composer}
            onSubmit={handleReviewSubmit}
          >
            <div className={styles.composerBody}>
              <div className={styles.composerContent}>
                <textarea
                  className={styles.composerTextarea}
                  placeholder="Share your thoughts about this movie"
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows={2}
                  required
                />
                <div className={styles.composerFooter}>
                  <div className={styles.actions}>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={!newReviewText.trim()}
                      title="Submit Review"
                      aria-label="Submit Review"
                    >
                      <Send size={15} className={styles.btnIcon} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className={styles.guestNotice}>
            <div className={styles.guestAvatar}>
              <User size={18} />
            </div>
            <div className={styles.guestText}>
              <Link
                to="/login"
                state={{
                  from: `${location.pathname}${location.search}`,
                  fromState: location.state,
                }}
                className={styles.guestLink}
              >
                Sign in
              </Link>{" "}
              to share your thoughts about this movie.
            </div>
          </div>
        )}

        {movie.reviews && movie.reviews.length > 0 && (
          <div className={styles.reviewsList}>
            {[...movie.reviews]
              .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
              .map((review, index) => (
                <div key={review._id || index} className={styles.reviewCard}>
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewAuthor}>{review.name}</span>
                      <div className={styles.reviewMeta}>
                        <span className={styles.reviewDate}>
                          {reviewDateFormatter.format(new Date(review.date))}
                        </span>

                        {props.user && props.user._id === review.user_id && (
                          <div className={styles.reviewActions}>
                            <Link
                              to={`/movies/${id}/review`}
                              state={{ currentReview: review }}
                              className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                              title="Edit Review"
                              aria-label="Edit review"
                            >
                              <Edit3 size={14} />
                            </Link>
                            <button
                              className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                              onClick={() => deleteReview(review._id)}
                              title="Delete Review"
                              aria-label="Delete review"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className={styles.reviewText}>{review.review}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movie;
