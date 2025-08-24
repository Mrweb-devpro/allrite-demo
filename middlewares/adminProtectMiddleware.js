module.exports = function (req, res, next) {
  const roles = req.roles;
  console.log(roles);
  if (!roles?.includes("admin")) return res.redirect("/index");
  // .status(403)
  // .json({ success: false, message: "You are not an admin" })
  next();
};
