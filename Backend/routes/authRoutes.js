
const express = require("express");
const signup = require("../controllers/signupController");
const login = require("../controllers/loginController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;


