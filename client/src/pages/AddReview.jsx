import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MovieDataService from "../services/movies.js";
import PageCard from "../components/ui/PageCard.jsx";
import BackLink from "../components/ui/BackLink.jsx";
import styles from "./AddReview.module.css";

const AddReview = (props) => {
  const { id } = useParams();
  let editing = false;
  let initialReviewState = "";

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setReview(event.target.value);
  };

  const saveReview = () => {
    const data = {
      review: review,
      name: props.user.name,
      user_id: props.user._id,
      movie_id: id,
    };

    MovieDataService.createReview(data)
      .then((response) => {
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <PageCard maxWidth="600px">
      <div className={styles.headerNav}>
        <BackLink to={`/movies/${id}`}>Back to Movie</BackLink>
      </div>

      <div className={styles.container}>
        {submitted ? (
          <div className={styles.submittedContainer}>
            <div className={styles.successIcon}>✓</div>
            <h4 className={styles.successTitle}>Review Submitted!</h4>
            <p className={styles.successMessage}>
              Thank you for sharing your thoughts on this movie.
            </p>
            <Link to={`/movies/${id}`} className={styles.returnBtn}>
              Return to Movie
            </Link>
          </div>
        ) : (
          <div className={styles.form}>
            <h3 className={styles.title}>
              {editing ? "Edit Review" : "Create Review"}
            </h3>

            <div className={styles.field}>
              <label className={styles.label}>Your Review</label>
              <textarea
                className={styles.textarea}
                placeholder="Write your review here"
                value={review}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              onClick={saveReview}
              className={styles.submitBtn}
              disabled={!review.trim()}
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </PageCard>
  );
};

export default AddReview;
