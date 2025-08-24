const productModel = require("../models/ProductModel");
const userModel = require("../models/UserModel");

exports.validateProductKeys = function (req, res, next) {
  console.log(req.body);

  const includesInvaildKeyNames = Object.keys(req.body).find((key) => {
    if (key === "category") return false;
    return !productModel.keySchema.includes(key);
  });

  if (includesInvaildKeyNames?.length > 0)
    return res.status(409).json({
      success: false,
      message: `❗In valid property❗Request Body only accepts :${productModel.keySchema.join(
        ","
      )}${req.method === "POST" ? ",category" : ""}`,
    });

  next();
};

exports.validateUserKeys = function (req, res, next) {
  if (!req.body || Object.values(req.body).length < 1)
    return res
      .status(400)
      .json({ success: false, message: "No data specified" });
  // Specify and error if user is trying to change the cart datatype
  if (typeof req.body?.cart !== "Object" && !req.body?.cart.length)
    return res.status(400).json({
      success: false,
      message: "Datatype of cart must be an Array",
    });

  const invaildKeyNames = Object.keys(req.body)
    .filter((key) => !userModel.keySchema.includes(key))
    .map((key) => (key === "" ? "Empty String ('')" : key));

  if (invaildKeyNames?.length)
    return res.status(409).json({
      success: false,
      message: `❗In valid property❗Request Body only accepts : username, email, password, cart. Propert${
        invaildKeyNames.length === 1 ? "y" : "ies"
      } of ${
        invaildKeyNames.length > 1
          ? invaildKeyNames.reduce((acc, cur, i, arr) => {
              if (arr.length === 2) return `${acc} and ${cur}.`;
              if (i === arr.length - 1) return `${acc}, and ${cur}.`;
              return `${acc}, ${cur}`;
            })
          : invaildKeyNames[0]
      } ${invaildKeyNames.length === 1 ? "is" : "are"} not allowed.`,
    });

  if (req.body?.["terms-conditions"])
    return res.status(409).json({
      success: false,
      message: "terms-conditions property is read-only",
    });
  if (req.body?.["roles"])
    return res
      .status(409)
      .json({ success: false, message: "roles property is read-only" });
  if (req.body?.["id"])
    return res
      .status(409)
      .json({ success: false, message: "id property is read-only" });

  next();
};
