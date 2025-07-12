const express = require("express");
const router = express.Router();
const { register, login, getAllUsers } = require("../controllers/user.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);

module.exports = router;
