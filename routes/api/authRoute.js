const authRoute = require("express").Router();

const authController = require("../../controllers/authController");

authRoute.post("/login", authController.login);
authRoute.get("/logout", authController.logout);
authRoute.get("/refresh", authController.refresh);

module.exports = authRoute;
