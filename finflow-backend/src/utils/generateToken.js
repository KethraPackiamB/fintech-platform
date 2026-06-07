const jwt = require("jsonwebtoken");
const { secret, expiresIn, refreshSecret, refreshExpiresIn } = require("../config/jwtConfig");

exports.generateAccessToken = (id, role) =>
  jwt.sign({ id, role }, secret, { expiresIn });

exports.generateRefreshToken = (id) =>
  jwt.sign({ id }, refreshSecret, { expiresIn: refreshExpiresIn });
