// const crypto = require("crypto"); // Node.js Modul für Kryptooperationen
const mongoose = require("mongoose"); // Mongoose für MongoDB-Operationen
const bcrypt = require("bcryptjs"); // Bcrypt für das Hashen von Passwörtern

// Definition des Schemas für den User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"], // Validierung: Benutzername erforderlich
    unique: true, // Muss eindeutig sein
  },
  password: {
    type: String,
    required: [true, "Please provide a password"], // Validierung: Passwort erforderlich
    minlength: 1, // Mindestlänge des Passworts
  },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

// // Middleware, die vor dem Speichern eines Dokuments ausgeführt wird, um das Passwort zu hashen
userSchema.pre("save", async function (next) {
  // Hash das Passwort mit Bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instanzmethode, um das Passwort des Benutzers zu überprüfen
userSchema.methods.correctPassword = async function (
  candidatePassword, // Das vom Benutzer eingegebene Passwort
  userPassword // Das in der Datenbank gespeicherte Passwort
) {
  // Vergleiche das eingegebene Passwort mit dem gespeicherten Passwort
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Erstelle das User-Modell basierend auf dem Schema
const User = mongoose.model("User", userSchema);

// Exportiere das User-Modell
module.exports = User;
