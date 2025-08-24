const jwt = require("jsonwebtoken");

const userModel = require("../models/UserModel");
const { REFRESH_TOKEN_SECRET } = require("../config/envConfig");

module.exports = function verifyLoginMiddleware(req, res, next) {
  const cookies = req.cookies;
  // if (!cookies?.jwt) return res.sendStatus(401);
  if (!cookies?.jwt) return res.redirect("/");

  const refreshToken = cookies.jwt;

  const foundUser = userModel.getUserByRefreshToken(refreshToken);

  if (!foundUser) {
    res.clearCookie("jwt");
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);
    req.userId = decoded.id;
    req.roles = decoded.roles;

    next();
  });
};
