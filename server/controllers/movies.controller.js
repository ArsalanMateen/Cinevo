import MoviesRepository from "../repositories/movies.repository.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const { moviesList, totalMovies } = await MoviesRepository.getMovies();

    let response = {
      moviesList,
      totalMovies,
    };
    res.json(response);
  }
}
