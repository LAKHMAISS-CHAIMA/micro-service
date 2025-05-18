const { body, validationResult } = require("express-validator");

const userValidator = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username needs to be 3+ characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email needs to be valid"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 4 }).withMessage("Password needs to be 4+ characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = userValidator;
