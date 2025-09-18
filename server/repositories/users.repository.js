import bcrypt from "bcryptjs";

let users;

export default class UsersRepository {
  static async injectDB(conn) {
    if (users) return;

    try {
      users = await conn.db(process.env.MONGODB_NS).collection("users");
    } catch (e) {
      console.error(`Unable to connect to users collection: ${e}`);
    }
  }

  static async register(name, email, password) {
    try {
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        return { error: "An account with this email already exists" };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await users.insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

      return {
        user: {
          _id: result.insertedId.toString(),
          name,
          email,
        },
      };
    } catch (e) {
      console.error(`Error during user registration: ${e}`);
      throw e;
    }
  }

  static async login(email, password) {
    try {
      const user = await users.findOne({ email });

      if (!user) {
        return { error: "Invalid email or password" };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return { error: "Invalid email or password" };
      }

      return {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      };
    } catch (e) {
      console.error(`Error during user login: ${e}`);
      throw e;
    }
  }
}
