import ReviewsRepository from "../repositories/reviews.repository.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = req.body.movie_id;
      const text = req.body.text || req.body.review;
      const userInfo = {
        name: req.body.name,
        email: req.body.email,
        _id: req.body.user_id,
      };

      const date = new Date();

      await ReviewsRepository.addReview(movieId, userInfo, text, date);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
