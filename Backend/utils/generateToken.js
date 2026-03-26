const jwt = require("jsonwebtoken");

const generateToken = (id, role, college) => {
  return jwt.sign({ id, role, college }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;