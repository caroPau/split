// Importiere notwendige Module und Modelle
const User = require("../models/userModel"); // User-Modell für den Zugriff auf die Benutzerdatenbank
const jwt = require("jsonwebtoken"); // jsonwebtoken für das Erstellen und Verifizieren von JWTs

// Login-Funktion
exports.login = async (req, res, next) => {
  try {
    // Extrahiere Benutzername und Passwort aus dem Anfragetext
    const { username, password } = req.body;

    // Finde den Benutzer in der Datenbank anhand des Benutzernamens
    const user = await User.findOne({ username });

    // Überprüfe, ob der Benutzer existiert
    if (!user) {
      // Wenn der Benutzer nicht existiert, sende eine Fehlermeldung zurück
      return res.status(400).json({
        status: "error",
        message: "User does not exist. Cannot login with that username.",
      });
    }

    // Überprüfe, ob das eingegebene Passwort mit dem gespeicherten Passwort übereinstimmt
    user
      .correctPassword(password, user.password) // Verwendet eine Methode des User-Modells zum Vergleich der Passwörter
      .then((isMatch) => {
        if (isMatch) {
          // JWT Token erstellen und senden
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN, // Token Ablaufzeit wird aus Umgebungsvariablen genommen
          });

          // Setze das Token in den Antwort-Headern
          res.setHeader("Authorization", `Bearer ${token}`);
          // Sende die Antwort mit dem Token und den Benutzerdaten
          res.status(200).json({
            status: "success",
            token,
            data: {
              user,
            },
          });
        } else {
          return res.status(400).json({
            status: "error",
            message: "Invalid password. Cannot login with that password.",
          });
        }
      })
      .catch((err) => {
        console.error(err); // Fehlerbehandlung und Ausgabe von Fehlern, die während der Passwortüberprüfung auftreten
      });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Server Error"); // Fehlermeldung bei Serverfehler
  }
};
