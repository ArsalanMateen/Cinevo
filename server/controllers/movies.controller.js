import MoviesRepository from "../repositories/movies.repository.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const limit = Number(req.query.moviesPerPage);
    let page = Number(req.query.page);

    const moviesPerPage =
      Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 20;

    page = Number.isInteger(page) && page >= 0 ? page : 0;

    const { moviesList, totalMovies } = await MoviesRepository.getMovies({
      page,
      moviesPerPage,
    });

    let response = {
      moviesList,
      page,
      moviesPerPage,
      totalMovies,
    };
    res.json(response);
  }
}
