const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const generateJWT = (uId, username, email) => {
  const payload = { uId, username, email };
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: "10h",
    });
    return token;
  } catch (err) {
    throw new Error(err + " No se pudo generar el token");
  }
};

module.exports = { generateJWT };
