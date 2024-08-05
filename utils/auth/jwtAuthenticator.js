const jwt = require("jsonwebtoken");

function validateToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    return {
      success: false,
      data: undefined,
    };
  }
}

module.exports = { validateToken };
