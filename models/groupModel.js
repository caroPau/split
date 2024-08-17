const mongoose = require("mongoose");

// Definiere das Schema für Gruppen
const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Please provide a groupname"], // Pflichtfeld mit Fehlermeldung bei Fehlen
    unique: false,
  },
  groupMembers: [
    {
      type: mongoose.Schema.Types.ObjectId, // Referenzen auf die Mitglieder der Gruppe
      ref: "User", // Verweis auf das `User`-Modell, um die Mitglieder zu speichern
    },
  ],
  balances: {
    type: Map, // Eine Map, die die Guthaben oder Schulden der Gruppenmitglieder speichert
    of: Number, // Der Wert jeder Map-Eintragung ist eine Zahl (das Guthaben)
    default: {}, // Standardmäßig ist die Map leer
  },
});

// Erstellt das `Group`-Modell aus dem Schema
const Group = mongoose.model("Group", groupSchema);

// Exportiert das `Group`-Modell zur Verwendung in anderen Teilen der Anwendung
module.exports = Group;
