const express = require("express");
const expenseController = require("./../controllers/expenseController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Middleware zum Schutz von Routen, die Authentifizierung erfordern
router.use(authController.protect);

// Route zum Abrufen aller Ausgaben eines Benutzers
router
  .route("/")
  .get(expenseController.getAllExpenses) // Erlaubt das Abrufen aller Ausgaben
  .post(expenseController.createExpense); // Erlaubt das Erstellen einer neuen Ausgabe

// Route zum Abrufen, Aktualisieren oder Löschen einer bestimmten Ausgabe anhand der ID
router
  .route("/:id")
  .get(expenseController.getExpense) // Erlaubt das Abrufen einer spezifischen Ausgabe
  .patch(expenseController.updateExpense) // Erlaubt das Aktualisieren einer spezifischen Ausgabe
  .delete(expenseController.deleteExpense); // Erlaubt das Löschen einer spezifischen Ausgabe

module.exports = router;
