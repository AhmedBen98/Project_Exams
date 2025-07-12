// src/middlewares/auth.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret");
    req.user = await User.findByPk(decoded.id);
    if (!req.user) return res.sendStatus(403);
    next();
  } catch {
    return res.sendStatus(403);
  }
};
