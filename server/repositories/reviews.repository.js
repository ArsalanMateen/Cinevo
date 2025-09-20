import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let reviews;

export default class ReviewsRepository {
  static async injectDB(conn) {
    if (reviews) return;

    try {
      reviews = await conn.db(process.env.MONGODB_NS).collection("reviews");
    } catch (e) {
      console.error(
        `Unable to connect to the MongoDB reviews collection. Please verify the database name and connection configuration: ${e}`,
      );
    }
  }

  static async addReview(movieId, user, review, date) {
    try {
      const reviewDoc = {
        name: user.name,
        email: user.email,
        user_id: user.user_id,
        movie_id: new ObjectId(movieId),
        review: review,
        date: date,
      };

      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      throw e;
    }
  }

  static async updateReview(reviewId, userId, review, date) {
    try {
      return await reviews.updateOne(
        {
          _id: new ObjectId(reviewId),
          user_id: userId,
        },
        { $set: { review: review, date: date } },
      );
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      throw e;
    }
  }
}
