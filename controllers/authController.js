// // Importiere notwendige Module und Modelle
// const User = require("../models/userModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");
// const jwt = require("jsonwebtoken");

// // Login-Funktion
// exports.login = catchAsync(async (req, res, next) => {
//   // Extrahiere Login-Daten aus dem Anfragekörper
//   const { login_name, login_password } = req.body;

//   // Überprüfen, ob die Login-Daten vorhanden sind
//   if (!login_name || !login_password) {
//     return next(new AppError("Please provide username and password!", 400)); // Fehler, wenn Daten fehlen
//   }

//   // Benutzer in der Datenbank finden und Passwort überprüfen
//   const user = await User.findOne({ username: login_name }).select("+password");

//   // Überprüfen, ob Benutzer existiert und Passwort korrekt ist
//   if (!user || !(await user.correctPassword(login_password, user.password))) {
//     return next(new AppError("Incorrect username or password", 401)); // Fehler bei falschen Anmeldedaten
//   }

//   // JWT Token erstellen und senden
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN, // Token Ablaufzeit
//   });

//   // Erfolgsantwort mit JWT Token
//   res.status(200).json({
//     status: "success",
//     token,
//   });
// });
