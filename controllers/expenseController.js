const Expense = require("./../models/expenseModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Funktion zum Abrufen aller Ausgaben eines Benutzers
exports.getAllExpenses = catchAsync(async (req, res, next) => {
  const expenses = await Expense.find({ user: req.user.id });

  res.status(200).json({
    status: "success",
    results: expenses.length,
    data: {
      expenses,
    },
  });
});

// Funktion zum Erstellen einer neuen Ausgabe
exports.createExpense = catchAsync(async (req, res, next) => {
  const newExpense = await Expense.create({
    ...req.body,
    user: req.user.id, // Verknüpft die Ausgabe mit dem angemeldeten Benutzer
  });

  res.status(201).json({
    status: "success",
    data: {
      expense: newExpense,
    },
  });
});

// Funktion zum Abrufen einer spezifischen Ausgabe
exports.getExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.user.toString() !== req.user.id) {
    return next(
      new AppError("No expense found with that ID or access denied", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      expense,
    },
  });
});

// Funktion zum Aktualisieren einer spezifischen Ausgabe
exports.updateExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.user.toString() !== req.user.id) {
    return next(
      new AppError("No expense found with that ID or access denied", 404)
    );
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      expense: updatedExpense,
    },
  });
});

// Funktion zum Löschen einer spezifischen Ausgabe
exports.deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense || expense.user.toString() !== req.user.id) {
    return next(
      new AppError("No expense found with that ID or access denied", 404)
    );
  }

  await Expense.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
