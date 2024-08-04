const crypto = require("crypto"); // Node.js Modul für Kryptooperationen
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
    minlength: 8, // Mindestlänge des Passworts
    select: false, // Passwort wird standardmäßig nicht aus der Datenbank abgerufen
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"], // Validierung: Passwortbestätigung erforderlich
    validate: {
      // Custom-Validator zur Überprüfung, ob passwordConfirm mit password übereinstimmt
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date, // Datum, wann das Passwort zuletzt geändert wurde
  passwordResetToken: String, // Token für das Zurücksetzen des Passworts
  passwordResetExpires: Date, // Ablaufdatum des Zurücksetzungstokens
  active: {
    type: Boolean,
    default: true, // Standardmäßig ist der Benutzer aktiv
    select: false, // Wird standardmäßig nicht aus der Datenbank abgerufen
  },
});

// Middleware, die vor dem Speichern eines Dokuments ausgeführt wird, um das Passwort zu hashen
userSchema.pre("save", async function (next) {
  // Wenn das Passwort nicht geändert wurde, überspringe diese Middleware
  if (!this.isModified("password")) return next();

  // Hash das Passwort mit Bcrypt
  this.password = await bcrypt.hash(this.password, 12);

  // Setze das Passwortbestätigungsfeld auf undefined, da es nicht in der DB gespeichert werden soll
  this.passwordConfirm = undefined;
  next();
});

// Middleware, die vor dem Speichern eines Dokuments ausgeführt wird, um das Passwortänderungsdatum zu setzen
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // Setze das Passwortänderungsdatum leicht vor der aktuellen Zeit, um mögliche Timing-Probleme zu vermeiden
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Middleware, die vor jeder find-Operation ausgeführt wird, um nur aktive Benutzer zu finden
userSchema.pre(/^find/, function (next) {
  // Füge eine Bedingung hinzu, um nur Benutzer zu finden, die aktiv sind
  this.find({ active: { $ne: false } });
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

// Instanzmethode, um zu überprüfen, ob das Passwort nach der Ausgabe des JWT geändert wurde
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // Konvertiere das Passwortänderungsdatum in einen Timestamp
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Überprüfe, ob das JWT vor der letzten Passwortänderung ausgestellt wurde
    return JWTTimestamp < changedTimestamp;
  }

  // Passwort wurde nicht geändert
  return false;
};

// Instanzmethode, um ein Token zum Zurücksetzen des Passworts zu erstellen
userSchema.methods.createPasswordResetToken = function () {
  // Erstelle ein zufälliges Token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash das Token und speichere es in der Datenbank
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Setze das Ablaufdatum des Tokens auf 10 Minuten
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Gib das unverschlüsselte Token zurück
  return resetToken;
};

// Erstelle das User-Modell basierend auf dem Schema
const User = mongoose.model("User", userSchema);

// Exportiere das User-Modell
module.exports = User;
