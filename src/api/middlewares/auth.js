const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config/vars");
const APIError = require("../errors/api-error");

function LOGGED_USER(req, res, next) {
  let user;
  if (req.headers.authorization === undefined) {
    throw new APIError({
      message: "Invalid Token",
      status: httpStatus.UNAUTHORIZED,
    });
  }

  try {
    const decoded = jwt.verify(
      req.headers.authorization.split(" ")[1],
      jwtSecret
    );

    req.authUserId = decoded.sub;
  } catch (e) {
    console.error(e);
    throw new APIError({
      message: "Invalid Token",
      status: httpStatus.UNAUTHORIZED,
    });
  }

  next();
}

exports.LOGGED_USER = LOGGED_USER;
