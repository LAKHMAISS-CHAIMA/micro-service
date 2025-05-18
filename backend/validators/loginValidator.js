const { body, validationResult } = require("express-validator");

const loginValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email needs to be valid"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = loginValidator;
