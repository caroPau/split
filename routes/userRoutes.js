const express = require("express");
const userController = require("./../controllers/userController");
// const authController = require("./../controllers/authController");

const router = express.Router();

// Route für die Registrierung eines neuen Benutzers
router.post("/register", userController.register);

// // Route für das Login eines Benutzers
// router.post("/login", authController.login);

// // Route für das Aktualisieren des Benutzers, Authentifizierung erforderlich
// router.patch("/updateMe", authController.protect, userController.updateMe);

// // Route für das Löschen des Benutzers, Authentifizierung erforderlich
// router.delete("/deleteMe", authController.protect, userController.deleteMe);

module.exports = router;
