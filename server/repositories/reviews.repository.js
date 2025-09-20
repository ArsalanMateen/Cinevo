import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let reviews;

export default class ReviewsRepository {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn
        .db(process.env.CINEVO_NS)
        .collection("reviews");
    } catch (e) {
      console.error(
        `Unable to connect to the MongoDB reviews collection. Please verify the database name and connection configuration: ${e}`,
      );
    }
  }

  static async addReview(movieId, user, text, date) {
    try {
      const reviewDoc = {
        name: user.name,
        email: user.email,
        movie_id: new ObjectId(movieId),
        text: text,
        date: date,
      };

      if (user._id) {
        reviewDoc.user_id = user._id;
      }

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      throw e;
    }
  }
}
