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
      password,
    });

    newUser.save(); // Speichern des neuen Benutzers in der Datenbank

    // JWT-Token für den neuen Benutzer erstellen
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
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
    console.log("ERROR: ", error);
    res.status(500).send("Server Error");
  }
};

// Controller zum Abrufen der Gruppen eines Benutzers
exports.getMyGroups = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extrahiere das Token aus dem Authorization-Header

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "No token provided", // Fehlermeldung, wenn kein Token bereitgestellt wurde
      });
    }

    const result = validateToken(token); // Token validieren

    if (!result.success) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token.",
      });
    }

    const userId = result.data.id; // Extrahiere die Benutzer-ID aus dem validierten Token

    const user = await User.findById(userId).populate("groups"); // Finde den Benutzer und populiere seine Gruppen

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        groups: user.groups, // Gebe die Gruppen des Benutzers in der Antwort zurück
      },
    });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Server Error");
  }
};

// Platzhalter für einen Controller zum Löschen eines Benutzers (noch nicht implementiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
