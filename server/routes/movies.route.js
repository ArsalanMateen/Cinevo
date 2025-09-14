import express from "express";
import MoviesController from "../controllers/movies.controller.js";

const router = express.Router();

router.route("/").get(MoviesController.apiGetMovies);

export default router;
