const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET_KEY;

exports.createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "30d" });
};
