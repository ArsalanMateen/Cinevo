import express from "express";
import ReviewsController from "../controllers/reviews.controller.js";

const router = express.Router();

router
  .route("/")
  .post(ReviewsController.apiPostReview)
  .put(ReviewsController.apiUpdateReview);

export default router;
