// const mongoose = require("mongoose"); // Mongoose für MongoDB-Operationen

// // Definition des Schemas für eine Ausgabe
// const expenseSchema = new mongoose.Schema({
//   description: {
//     type: String,
//     required: [true, "An expense must have a description"], // Validierung: Beschreibung erforderlich
//   },
//   amount: {
//     type: Number,
//     required: [true, "An expense must have an amount"], // Validierung: Betrag erforderlich
//     min: [0, "Amount must be greater than or equal to 0"], // Validierung: Betrag muss >= 0 sein
//   },
//   date: {
//     type: Date,
//     default: Date.now, // Standardwert ist das aktuelle Datum
//   },
//   category: {
//     type: String,
//     required: [true, "An expense must have a category"], // Validierung: Kategorie erforderlich
//     enum: ["Food", "Transport", "Entertainment", "Health", "Other"], // Begrenzung auf vordefinierte Kategorien
//   },
//   user: {
//     type: mongoose.Schema.ObjectId, // Verweis auf ein Benutzerobjekt
//     ref: "User",
//     required: [true, "An expense must belong to a user"], // Validierung: Benutzer erforderlich
//   },
// });

// // Middleware, die vor jeder find-Operation ausgeführt wird, um den Benutzer zu referenzieren
// expenseSchema.pre(/^find/, function (next) {
//   // Füge eine Bedingung hinzu, um den Benutzer mit auszuwählen, aber nur den Benutzernamen
//   this.populate({
//     path: "user",
//     select: "username", // Optional: Nur den Benutzernamen des Ausgabenbesitzers anzeigen
//   });
//   next();
// });

// // Erstelle das Expense-Modell basierend auf dem Schema
// const Expense = mongoose.model("Expense", expenseSchema);

// // Exportiere das Expense-Modell
// module.exports = Expense;
