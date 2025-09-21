import express from "express";
import MoviesController from "../controllers/movies.controller.js";
import reviewsRouter from "./reviews.route.js";
import usersRouter from "./users.route.js";

const router = express.Router();

router.route("/").get(MoviesController.apiGetMovies);
router.route("/id/:id").get(MoviesController.apiGetMovieById);
router.route("/genres").get(MoviesController.apiGetGenres);

router.use("/reviews", reviewsRouter);
router.use("/users", usersRouter);

export default router;
