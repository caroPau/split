// Importiere das User-Modell, catchAsync für asynchrone Fehlerbehandlung und AppError für Fehlerobjekte
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { validateToken } = require("./../utils/auth/jwtAuthenticator"); // Token-Validierungsfunktion

// Controller zur Registrierung eines neuen Benutzers
exports.register = catchAsync(async (req, res, next) => {
  const { username, password } = req.body; // Extrahiere Benutzername und Passwort aus der Anfrage

  // Überprüfen, ob alle erforderlichen Felder vorhanden sind
  if (!username || !password) {
    return next(new AppError("Please provide all required fields", 400)); // Fehlermeldung, wenn Felder fehlen
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
});

// Controller zum Abrufen der Gruppen eines Benutzers
exports.getMyGroups = catchAsync(async (req, res, next) => {
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
      message: "Invalid token.", // Fehlermeldung bei ungültigem Token
    });
  }

  const userId = result.data.id; // Extrahiere die Benutzer-ID aus dem validierten Token

  const user = await User.findById(userId).populate("groups"); // Finde den Benutzer und populiere seine Gruppen

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found", // Fehlermeldung, wenn der Benutzer nicht gefunden wird
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      groups: user.groups, // Gebe die Gruppen des Benutzers in der Antwort zurück
    },
  });
});

// Platzhalter für einen Controller zum Löschen eines Benutzers (noch nicht implementiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!", // Fehlermeldung, dass die Route noch nicht definiert ist
  });
};
