const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  REFRESH_TOKEN_SECRET,
  MAX_AGE,
  NODE_ENV,
} = require("../config/envConfig");
const userModel = require("../models/UserModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/jwtConfig");

//-- LOGIN
module.exports.login = async function (req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({
      success: false,
      message: "Both Email and Password are required",
    });

  const foundUser = userModel.getUserByEmail(email);

  if (!foundUser || !(await bcrypt.compare(password, foundUser.password)))
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  const accessToken = generateAccessToken(foundUser);
  const refreshToken = generateRefreshToken(foundUser);

  userModel.setRefreshToken(foundUser.id, refreshToken);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: NODE_ENV === "production",
    maxAge: Number(MAX_AGE) * 24 * 60 * 60 * 1000, // MAX_AGE DAYS
  });
  res.json({ accessToken });
};

//-- LOGOUT
module.exports.logout = (req, res) => {
  console.log("clicking");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //successful no

  const refreshToken = cookies.jwt;
  const foundUser = userModel.getUserByRefreshToken(refreshToken);

  if (!foundUser) {
    res.clearCookie("jwt", {
      sameSite: "strict",
      maxAge: Number(MAX_AGE) * 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }

  // Delete the refresh token in the database
  userModel.deleteRefreshToken(foundUser.id);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: NODE_ENV === "production",
  });
  res.sendStatus(204);
};

//-- REFRESH
module.exports.refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  const foundUser = userModel.getUserByRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt");
    return res.sendStatus(403);
    // return res.redirect("/login");
  } //forbidden

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    userModel.setRefreshToken(foundUser.id, refreshToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: NODE_ENV === "production",
    });
    res.json({ accessToken });
  });
};
