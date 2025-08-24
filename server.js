//-- BUILT-IN & EXTERNAL modules
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

//-- custom modules
const { PORT } = require("./config/envConfig");
const productRoute = require("./routes/api/productRoute");
const userRoute = require("./routes/api/userRoute");
const authRoute = require("./routes/api/authRoute");
const pageRoute = require("./routes/pages/pageRoute");
const authenticateTokenMiddleware = require("./middlewares/authenticateTokenMiddleware");

const app = express();

//--  middleware
app.use(express.static("./public")); // to render all the other frontend content and logic that is not being handlledin the routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//-- API Routes
app.use("/api/products", authenticateTokenMiddleware, productRoute);
app.use("/api/users", userRoute);
app.use("/api/auth/", authRoute);

//-- PAGE Route
app.use(pageRoute);

//-- 404 route
app.use("/*splat", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
});
