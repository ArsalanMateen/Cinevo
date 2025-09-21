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
    sort = "year:desc",
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

    let cursor; // to store the pointer to the query result set
    try {
      cursor = movies
        .find(query)
        .sort(sortCriteria)
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

  static async getMovieById(id) {
    // check if the provided id is a valid ObjectId before proceeding with the query
    if (!ObjectId.isValid(id)) {
      return null;
    }

    try {
      return await movies
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "reviews",
              localField: "_id",
              foreignField: "movie_id",
              as: "reviews",
            },
          },
        ])
        .next(); // return the result of the aggregation pipeline as single object (or null if no matching document is found)
    } catch (e) {
      console.error(
        `Unable to retrieve movie with id: "${id}" from the database: ${e}`,
      );
      throw e;
    }
  }

  static async getGenres() {
    try {
      const genres = await movies.distinct("genres");
      return genres.filter(Boolean).sort(); // filter out any null or undefined values and sort the genres alphabetically
    } catch (e) {
      console.error(`Unable to retrieve movie genres from the database: ${e}`);
      throw e;
    }
  }
}
