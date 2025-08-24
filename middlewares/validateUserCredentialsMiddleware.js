const Joi = require("joi");

exports.validateCreateUser = function (req, res, next) {
  if (!req.body || Object.values(req.body).length < 1)
    return res.status(400).json({
      success: false,
      message: "No Data was specified in the request body",
    });

  const schema = Joi.object({
    username: Joi.string().alphanum().min(6).max(30).required(),
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    ["terms-conditions"]: Joi.boolean().required().equal(true),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  // Validate the Data
  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).json({ success: false, message: error.message });
  else next();
};
