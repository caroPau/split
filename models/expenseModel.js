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

const mongoose = require("mongoose");

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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
