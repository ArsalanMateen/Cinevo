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
}
