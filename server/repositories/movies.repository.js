import { ObjectId } from "mongodb";

let movies;

export default class MoviesRepository {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db(process.env.MOVIES_NS).collection("movies");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in moviesRepository: ${e}`,
      );
    }
  }

  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
    sort = "year:desc",
  } = {}) {
    let query = {};

    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("genre" in filters) {
        query = { genres: { $in: [filters["genre"]] } };
      }
    }

    if (sort === "rating:desc" || sort === "rating:asc") {
      query["imdb.rating"] = { $type: "number" };
    } else if (sort === "awards:desc") {
      query["awards.wins"] = { $gt: 0 };
    } else if (sort === "comments:desc") {
      query["num_mflix_comments"] = { $gt: 0 };
    }

    const sortOptions = {
      "year:desc": { year: -1 },
      "year:asc": { year: 1 },
      "rating:desc": { "imdb.rating": -1 },
      "rating:asc": { "imdb.rating": 1 },
      "awards:desc": { "awards.wins": -1, "imdb.rating": -1 },
      "comments:desc": { "num_mflix_comments": -1, "imdb.rating": -1 },
    };

    const sortCriteria = sortOptions[sort] ?? sortOptions["year:desc"];

    let cursor;
    try {
      cursor = movies
        .find(query)
        .sort(sortCriteria)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);

      const moviesList = await cursor.toArray();
      const totalMovies = await movies.countDocuments(query);
      return { moviesList, totalMovies };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalMovies: 0 };
    }
  }

  static async getGenres() {
    let genres = [];
    try {
      genres = await movies.distinct("genres");
      return genres.filter(Boolean).sort();
    } catch (e) {
      console.error(`Unable to get genres, ${e}`);
      throw e;
    }
  }

  static async getMovieById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await movies.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(
        `Unable to retrieve movie with id: "${id}" from the database: ${e}`,
      );
      throw e;
    }
  }
}
