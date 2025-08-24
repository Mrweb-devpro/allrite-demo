const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel");

const jwt = require("jsonwebtoken");
const { REFRESH_TOKEN_SECRET } = require("../config/envConfig");

//-- GET all users
module.exports.getAllUsers = function (req, res) {
  try {
    const allUsers = userModel.get();
    res.json({ success: true, data: allUsers });
  } catch (err) {
    res.sendStatus(500);
  }
};

//-- GET a user
module.exports.getUser = function (req, res) {
  const { id } = req.params;
  // check if that user exist
  const foundUser = userModel.getUser(id);
  if (!foundUser)
    return res.status(404).json({
      success: false,
      message: `User with ID: (${id}) was not found`,
    });

  res.status(200).json({ success: true, data: foundUser });
};
//-- Create new User
module.exports.createUser = async function (req, res) {
  const { username, email, password } = req.body;

  // Checking if a user with the email already exist
  const duplicate = userModel.getUserByEmail(email);
  if (duplicate)
    return res.status(409).json({
      success: false,
      message: `User with the Email ${email} already exist `,
    });

  // create the user
  try {
    const hashedpwd = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashedpwd,
    });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
//-- Update User
module.exports.updateUser = async function async(req, res) {
  const { id } = req.params;

  // check if user exist
  const foundUser = userModel.getUser(id);
  let newPwd;

  if (!foundUser)
    return res.status(404).json({
      success: false,
      message: `User with ID: (${id}) was not found`,
    });

  if (req.body?.password) {
    const match = await bcrypt.compare(req.body.password, foundUser.password);

    if (match) {
      newPwd = "";
      return res.status(409).json({
        success: false,
        message: "Password must be different from the old one",
      });
    }
    newPwd = await bcrypt.hash(req.body?.password, 10);
  }
  try {
    const updatedUser = await userModel.update(id, {
      ...req.body,
      password: newPwd ? newPwd : foundUser.password,
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//-- Delete User
module.exports.deleteUser = function (req, res) {
  const { id } = req.params;
  const foundUser = userModel.getUser(id);

  if (!foundUser)
    return res.status(404).json({
      success: false,
      message: `User with ID: (${id}) was not found`,
    });

  try {
    userModel.delete(id);
    res.status(204).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//-- GET current USER
module.exports.getCurrentUser = function (req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const user = userModel.getUser(decoded.id);
    res.json({ success: true, data: user });
  });
};
