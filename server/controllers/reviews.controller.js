import ReviewsRepository from "../repositories/reviews.repository.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const review = req.body.review;

      const userInfo = {
        name: req.body.name,
        email: req.body.email,
        user_id: req.body.user_id,
      };

      const date = new Date();

      await ReviewsRepository.addReview(movieId, userInfo, review, date);

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const { review_id, review, user_id } = req.body;
      const date = new Date();
      const ReviewResponse = await ReviewsRepository.updateReview(
        review_id,
        user_id,
        review,
        date,
      );

      if (ReviewResponse.modifiedCount === 0) {
        throw new Error(
          "Unable to update review. User may not be original poster",
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
