const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

// Registrierung eines neuen Benutzers
router.post("/register", userController.register);

// Benutzer-Login
router.post("/login", authController.login);

module.exports = router;
