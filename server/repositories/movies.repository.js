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
}
