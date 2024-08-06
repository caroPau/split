// Importiere notwendige Module und Modelle
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

// // Login-Funktion
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log("Username: ", username);

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "User does not exist. Cannot login with that username.",
    });
  }
  console.log("Password: " + user.password);

  user
    .correctPassword(password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        console.log("Passwords match");

        // JWT Token erstellen und senden
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN, // Token Ablaufzeit
        });
        // Set the token in the response headers
        res.setHeader("Authorization", `Bearer ${token}`);
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        console.log("Passwords do not match");
        return res.status(400).json({
          status: "error",
          message: "Invalid password. Cannot login with that password.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

exports.logout = (req, res) => {
  res.status(200).json({
    status: 'success',
  });
}
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
