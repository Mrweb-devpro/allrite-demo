const {
  validateCreateUser,
} = require("../../middlewares/validateUserCredentialsMiddleware");
const {
  validateUserKeys,
} = require("../../middlewares/validateKeyNamesMiddleware");
const authenticateTokenMiddleware = require("../../middlewares/authenticateTokenMiddleware");
const userController = require("../../controllers/userController");

const UserRoute = require("express").Router();

//-- Create new User
UserRoute.post("/create", validateCreateUser, userController.createUser);

//-- GET all users
UserRoute.get("/currentUser", userController.getCurrentUser);

//-- //--adding authorization MIDDLEWARE  to all routes bellow
UserRoute.use(authenticateTokenMiddleware);

//-- GET all users
UserRoute.get("/", userController.getAllUsers);

//-- GET a user
UserRoute.get("/:id", userController.getUser);

//-- Update User
UserRoute.put("/:id", [validateUserKeys], userController.updateUser);

//-- Delete User
UserRoute.delete("/:id", userController.deleteUser);

module.exports = UserRoute;
