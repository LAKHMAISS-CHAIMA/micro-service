const { body, validationResult } = require("express-validator");

module.exports = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username needs to be 3+ characters"),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email needs to be valid"),

  body("phoneNumber")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^0[6-7]\d{8}$/).withMessage("Phone must start with 06 or 07 and be 10 digits"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["user", "admin"]).withMessage("Role must be 'user' or 'admin'"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be 6+ characters"),

  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
