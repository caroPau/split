// Importiere das User-Modell, catchAsync und AppError
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Controller zum Abrufen aller Benutzer
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // Sende die Antwort
//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// // Controller zum Abrufen eines Benutzers (noch nicht definiert)
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };

exports.register = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Überprüfen, ob alle erforderlichen Felder vorhanden sind
  if (!username || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }

  // Neuen Benutzer erstellen
  const newUser = await User.create({
    username,
    password,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Controller zum Erstellen eines Benutzers (noch nicht definiert)
exports.createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "User erfolgreich angelegt",
  });
};

// Controller zum Löschen eines Benutzers (noch nicht definiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
