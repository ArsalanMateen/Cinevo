import app from "./app.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesRepository from "./repositories/movies.repository.js";
import ReviewsRepository from "./repositories/reviews.repository.js";
import UsersRepository from "./repositories/users.repository.js";

async function main() {
  dotenv.config();
  const client = new mongodb.MongoClient(process.env.MONGODB_URI);
  const port = process.env.PORT || 8000;

  try {
    await client.connect();

    await MoviesRepository.injectDB(client);
    await ReviewsRepository.injectDB(client);
    await UsersRepository.injectDB(client);

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);
