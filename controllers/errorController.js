// // Importiere das AppError-Modul, um benutzerdefinierte Fehler zu erstellen
// const AppError = require("./../utils/appError");

// // Funktion zur Behandlung von CastError bei MongoDB
// const handleCastErrorDB = (err) => {
//   // Erstelle eine Fehlermeldung für ungültige Datentypen
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   // Gib einen neuen AppError mit Statuscode 400 zurück
//   return new AppError(message, 400);
// };

// // Funktion zur Behandlung von Duplikatfehlern bei MongoDB
// const handleDuplicateFieldsDB = (err) => {
//   // Extrahiere den duplizierten Wert aus der Fehlermeldung
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);

//   // Erstelle eine Fehlermeldung für den duplizierten Wert
//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   // Gib einen neuen AppError mit Statuscode 400 zurück
//   return new AppError(message, 400);
// };

// // Funktion zur Behandlung von Validierungsfehlern bei MongoDB
// const handleValidationErrorDB = (err) => {
//   // Extrahiere alle Fehlermeldungen aus dem Fehlerobjekt
//   const errors = Object.values(err.errors).map((el) => el.message);

//   // Erstelle eine Fehlermeldung für ungültige Eingabedaten
//   const message = `Invalid input data. ${errors.join(". ")}`;
//   // Gib einen neuen AppError mit Statuscode 400 zurück
//   return new AppError(message, 400);
// };

// // Funktion zur Behandlung von ungültigen JWT-Token
// const handleJWTError = () =>
//   new AppError("Invalid token. Please log in again!", 401);

// // Funktion zur Behandlung von abgelaufenen JWT-Token
// const handleJWTExpiredError = () =>
//   new AppError("Your token has expired! Please log in again.", 401);

// // Funktion zur Fehlerbehandlung im Entwicklungsmodus
// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

// // Funktion zur Fehlerbehandlung im Produktionsmodus
// const sendErrorProd = (err, res) => {
//   // Operational, vertrauenswürdiger Fehler: sende die Fehlermeldung an den Client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });

//     // Programmierfehler oder unbekannter Fehler: keine Fehlerdetails leaken
//   } else {
//     // 1) Logge den Fehler
//     console.error("ERROR 💥", err);

//     // 2) Sende eine generische Fehlermeldung
//     res.status(500).json({
//       status: "error",
//       message: "Something went very wrong!",
//     });
//   }
// };

// // Hauptfehlerbehandlungsfunktion
// module.exports = (err, req, res, next) => {
//   // Setze den Standardstatuscode und -status, falls nicht gesetzt
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   // Fehlerbehandlung im Entwicklungsmodus
//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, res);
//     // Fehlerbehandlung im Produktionsmodus
//   } else if (process.env.NODE_ENV === "production") {
//     let error = { ...err };

//     // Behandlung spezifischer Fehlerarten
//     if (error.name === "CastError") error = handleCastErrorDB(error);
//     if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//     if (error.name === "ValidationError")
//       error = handleValidationErrorDB(error);
//     if (error.name === "JsonWebTokenError") error = handleJWTError();
//     if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

//     // Sende den Fehler im Produktionsmodus
//     sendErrorProd(error, res);
//   }
// };
