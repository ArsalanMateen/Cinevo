import React, { useState, useEffect } from "react";
import MovieDataService from "../services/movies.js";
import { Link, useParams, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Send } from "lucide-react";
import PageCard from "../components/ui/PageCard.jsx";
import styles from "./AddReview.module.css";

const AddReview = (props) => {
  const { id } = useParams();
  const location = useLocation();
  let editing = false;
  let initialReviewState = "";

  if (location.state && location.state.currentReview) {
    editing = true;
    initialReviewState = location.state.currentReview.review || "";
  }

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = editing ? "Edit Review | Cinevo" : "Add Review | Cinevo";
  }, [editing]);

  const saveReview = () => {
    const data = {
      review: review,
      name: props.user.name,
      email: props.user.email,
      user_id: props.user._id,
      movie_id: id,
    };

    if (editing) {
      data.review_id = location.state.currentReview._id;

      MovieDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      MovieDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <PageCard maxWidth="480px">
      {submitted ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <CheckCircle2
              size={52}
              className={styles.successSvg}
            />
          </div>
          <p className={styles.successText}>
            Review {editing ? "updated" : "submitted"} successfully!
          </p>
          <Link to={"/movies/" + id} className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>Back to Movie</span>
          </Link>
        </div>
      ) : (
        <div style={{ width: "100%", textAlign: "left" }}>
          <h2 className={styles.title}>
            {editing ? "Edit" : "Add"} Review
          </h2>
          <p className={styles.subtitle}>
            Share your thoughts about this movie
          </p>

          <div className={styles.group}>
            <label className={styles.label}>Your Review</label>
            <textarea
              className={styles.textarea}
              placeholder="Write your review here"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>

          <button
            className={styles.submitBtn}
            type="button"
            onClick={saveReview}
          >
            <Send size={16} />
            <span>{editing ? "Update" : "Submit"} Review</span>
          </button>
        </div>
      )}
    </PageCard>
  );
};

export default AddReview;
