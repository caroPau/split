// Importiert das JWT-Modul zur Verarbeitung von JSON Web Tokens
const jwt = require("jsonwebtoken");

// Funktion zur Validierung eines JWT-Tokens
function validateToken(token) {
  let decoded;
  try {
    // Versucht, das Token mit dem geheimen Schlüssel zu entschlüsseln
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gibt bei erfolgreicher Validierung das entschlüsselte Token zurück
    return {
      success: true,
      data: decoded,
    };
  } catch (error) {
    // Gibt bei einem Fehler an, dass die Validierung fehlgeschlagen ist
    return {
      success: false,
      data: undefined,
    };
  }
}

// Exportiert die validateToken-Funktion, damit sie in anderen Modulen verwendet werden kann
module.exports = { validateToken };
