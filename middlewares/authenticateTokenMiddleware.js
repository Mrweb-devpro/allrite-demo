const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET } = require("../config/envConfig");

module.exports = function (req, res, next) {
  const authHeader =
    req.header?.("authorization") || req.header?.("Authorization");

  const token = authHeader?.startsWith(`Bearer `) && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.id;
    req.roles = decoded.roles;

    next();
  });
};
