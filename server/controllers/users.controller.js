import UsersRepository from "../repositories/users.repository.js";

const validate = (res, fields) => {
  const missing = [];

  for (const key in fields) {
    if (!fields[key]?.trim()) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    res.status(400).json({
      error: `${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} required`,
    });
    return false;
  }
  return true;
};

export default class UsersController {
  static async apiRegister(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!validate(res, { name, email, password })) return;

      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
      }

      const result = await UsersRepository.register(
        name.trim(),
        email.trim().toLowerCase(),
        password,
      );

      if (result.error) {
        return res.status(400).json({ error: result.error });
      }

      res.status(201).json({
        status: "success",
        user: result.user,
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
