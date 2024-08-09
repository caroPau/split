const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Route für die Registrierung eines neuen Benutzers
router.post("/register", userController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/myGroups", userController.getMyGroups);



// // Route für das Aktualisieren des Benutzers, Authentifizierung erforderlich
// router.patch("/updateMe", authController.protect, userController.updateMe);

// // Route für das Löschen des Benutzers, Authentifizierung erforderlich
// router.delete("/deleteMe", authController.protect, userController.deleteMe);

module.exports = router;
