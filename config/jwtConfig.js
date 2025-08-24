const jwt = require("jsonwebtoken");

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRESIN,
  ACCESS_TOKEN_EXPIRESIN,
} = require("../config/envConfig");

//-- ACCESS TOKEN
module.exports.generateAccessToken = function (user) {
  const token = jwt.sign(
    {
      id: user.id,
      roles: user.roles,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRESIN,
    }
  );

  return token;
};

//-- REFRESH TOKEN
module.exports.generateRefreshToken = function (user) {
  const token = jwt.sign(
    {
      id: user.id,
      roles: user.roles,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRESIN,
    }
  );

  return token;
};
