const mongoose = require("mongoose");

// Definiere das Schema für Ausgaben (Expenses)
const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
  },
  group: {
    type: mongoose.Schema.Types.ObjectId, // Referenz zur Gruppe, der die Ausgabe zugeordnet ist
    ref: "Group", // Verweis auf das `Group`-Modell
    required: true, // Pflichtfeld, da jede Ausgabe einer Gruppe zugeordnet sein muss
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId, // Referenz auf den Benutzer, der die Ausgabe bezahlt hat
    ref: "User", // Verweis auf das `User`-Modell
    required: true, // Pflichtfeld, da jede Ausgabe einem Benutzer zugeordnet sein muss
  },
  date: {
    type: Date, // Datum der Ausgabe
    default: Date.now, // Standardmäßig wird das aktuelle Datum verwendet
  },
});

// Erstellt das `Expense`-Modell aus dem Schema
const Expense = mongoose.model("Expense", expenseSchema);

// Exportiert das `Expense`-Modell zur Verwendung in anderen Teilen der Anwendung
module.exports = Expense;
