const { check, validationResult } = require("express-validator");

exports.signupValidator = [
  check("username")
    .not()
    .isEmpty()
    .trim()
    .withMessage("All fields are required"),
  check("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must be greater than 3 characters"),
];

exports.signinValidator = [
  check("email").isEmail().normalizeEmail().withMessage("Invalid Email"),
  check("password")
    .isLength({ min: 4 })
    .withMessage("Password must greater than 3 characters"),
];

exports.tweetValidator = [
  check("tweet").not().isEmpty().trim().withMessage("Tweet cannot be empty"),
];

exports.validatorResult = (req, res, next) => {
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();
  if (hasErrors) {
    const errorMessage = result.array()[0].msg;
    return res.status(422).json({ errorMessage });
  }
  next();
};
