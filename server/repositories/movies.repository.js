import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let movies; // to store the reference to the movies collection in the database

export default class MoviesRepository {
  static async injectDB(conn) {
    if (movies) return;
    try {
      movies = await conn.db(process.env.MONGODB_NS).collection("movies");
    } catch (e) {
      console.error(
        `Unable to connect to the MongoDB movies collection. Please verify the database name and connection configuration: ${e}`,
      );
    }
  }

  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
    sort = null,
  } = {}) {
    let query = {};

    if (filters) {
      if (filters.hasOwnProperty("title")) {
        query.title = {
          $regex: filters["title"],
          $options: "i", // case-insensitive flag
        };
      }
      if (filters.hasOwnProperty("genre")) {
        query.genres = {
          $eq: filters["genre"], // $eq (equality operatory): checks if the an item equals the given value
        };
      }
    }

    let cursor;
    try {
      cursor = movies
        .find(query)
        .limit(moviesPerPage)
        .skip(moviesPerPage * page);

      const [moviesList, totalMovies] = await Promise.all([
        cursor.toArray(),
        movies.countDocuments(query),
      ]);
      return { moviesList, totalMovies };
    } catch (e) {
      console.error(`Unable to retrieve movies from the database: ${e}`);
      return { moviesList: [], totalMovies: 0 };
    }
  }
}
