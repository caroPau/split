const User = require("./../models/userModel");
const { validateToken } = require("./../utils/auth/jwtAuthenticator"); // Token-Validierungsfunktion
const jwt = require("jsonwebtoken"); // JSON Web Token-Bibliothek

// Controller zur Registrierung eines neuen Benutzers
exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body; // Extrahiere Benutzername und Passwort aus der Anfrage

    // Überprüfen, ob alle erforderlichen Felder vorhanden sind
    if (!username || !password) {
      // Fehlermeldung, wenn Felder fehlen
      return res.status(400).json({
        status: "fail",
        message: "Please provide all required fields",
      });
    }

    // Überprüfen, ob der Benutzername bereits existiert
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(403).json({
        status: "fail",
        message: "Username already exists", // Fehlermeldung, wenn der Benutzername bereits vergeben ist
      });
    }

    // Neuen Benutzer erstellen
    const newUser = await User.create({
      username,
      password, // Speichern von Benutzername und Passwort im neuen Benutzerobjekt
    });

    newUser.save(); // Speichern des neuen Benutzers in der Datenbank

    // JWT-Token für den neuen Benutzer erstellen
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token Ablaufzeit aus den Umgebungsvariablen
    });

    // Setze das Token in den Antwortheader
    res.setHeader("Authorization", `Bearer ${token}`);

    res.status(201).json({
      status: "success",
      token, // Gebe das Token in der Antwort zurück
      data: {
        user: newUser, // Gebe den neu erstellten Benutzer zurück
      },
    });
  } catch (error) {
    console.log("ERROR: ", error); // Fehlerbehandlung und Ausgabe von Fehlern
    res.status(500).send("Server Error"); // Fehlermeldung bei Serverfehler
  }
};

// Platzhalter für einen Controller zum Löschen eines Benutzers (noch nicht implementiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!", // Fehlermeldung, dass die Route noch nicht definiert ist
  });
};
