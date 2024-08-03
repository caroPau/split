const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "An expense must have a description"],
  },
  amount: {
    type: Number,
    required: [true, "An expense must have an amount"],
    min: [0, "Amount must be greater than or equal to 0"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: [true, "An expense must have a category"],
    enum: ["Food", "Transport", "Entertainment", "Health", "Other"], // Beispielkategorien
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An expense must belong to a user"],
  },
});

// Middleware, um sicherzustellen, dass nur Ausgaben des angemeldeten Benutzers zurückgegeben werden
expenseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username", // Optional: Benutzername des Ausgabenbesitzers anzeigen
  });
  next();
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
