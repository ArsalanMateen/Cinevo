import MoviesRepository from "../repositories/movies.repository.js";

export default class MoviesController {
  static async apiGetMovies(req, res, next) {
    const limit = Number(req.query.moviesPerPage);
    let page = Number(req.query.page);

    const moviesPerPage =
      Number.isInteger(limit) && limit > 0 ? Math.min(limit, 50) : 20;

    page = Number.isInteger(page) && page >= 0 ? page : 0;

    let filters = {};

    if (req.query.genre) {
      filters.genre = req.query.genre;
    }

    if (req.query.title) {
      filters.title = req.query.title;
    }

    const sort = req.query.sort || "year:desc";

    const { moviesList, totalMovies } = await MoviesRepository.getMovies({
      filters,
      page,
      moviesPerPage,
      sort,
    });

    let response = {
      moviesList,
      page,
      filters,
      moviesPerPage,
      totalMovies,
    };
    res.json(response);
  }

  static async apiGetMovieById(req, res, next) {
    try {
      const { id } = req.params;
      const movie = await MoviesRepository.getMovieById(id);

      if (!movie) {
        res.status(404).json({ error: "Movie not found" });
        return;
      }

      res.json(movie);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetGenres(req, res, next) {
    try {
      let propertyTypes = await MoviesRepository.getGenres();
      res.json(propertyTypes);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
}
