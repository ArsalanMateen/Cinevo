import express from "express";
import UsersController from "../controllers/users.controller.js";

const router = express.Router();

router.route("/login").post(UsersController.apiLogin);
router.route("/register").post(UsersController.apiRegister);

export default router;
