const express = require("express");
const groupController = require("../controllers/groupController");

const router = express.Router();

// Neue Gruppe erstellen
router.post("/newGroup/create", groupController.createGroup);

// Benutzer validieren
router.post("/validate", groupController.validateUsers);

// Alle Gruppen abrufen
router.get("/", groupController.getGroups);

// Gruppe nach ID abrufen
router.get("/:id", groupController.getGroupById);

// Neue Ausgabe zu einer Gruppe hinzufügen
router.post("/:id/expenses", groupController.addNewExpense);

module.exports = router;
