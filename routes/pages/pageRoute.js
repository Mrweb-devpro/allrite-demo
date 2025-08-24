const pageRoute = require("express").Router();
const path = require("path");
const adminProtectMiddleware = require("../../middlewares/adminProtectMiddleware");
const verifyLoginMiddleware = require("../../middlewares/verifyLoginMiddleware");

function getHTMLPath(name) {
  return path.join(__dirname, "../../", "views", `${name}.html`);
}
//-- ADMIN
pageRoute.get(
  ["/admin", "/admin.html"],
  [verifyLoginMiddleware, adminProtectMiddleware],
  (req, res) => {
    res.sendFile(getHTMLPath("admin"));
  }
);
//-- dashoard
pageRoute.get(["/", "/index", "/index.html"], (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.redirect("/login");
  res.sendFile(getHTMLPath("index"));
});

//If user is login in the REDIRECT them tothe dashboard
pageRoute.use((req, res, next) => {
  const cookies = req.cookies;
  if (cookies?.jwt) return res.redirect("/");
  next();
});
//-- login
pageRoute.get(["/login", "/login.html"], (req, res) => {
  res.sendFile(getHTMLPath("login"));
});

//-- signup
pageRoute.get(["/signup", "/signup.html"], (req, res) => {
  res.sendFile(getHTMLPath("signup"));
});

module.exports = pageRoute;
