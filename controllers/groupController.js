// Importiere notwendige Module und Modelle
const mongoose = require("mongoose"); // Mongoose für den Zugriff auf die MongoDB-Datenbank
const WebSocket = require("ws"); // WebSocket für Echtzeitkommunikation
const Group = require("./../models/groupModel"); // Group-Modell für Gruppendaten
const User = require("../models/userModel"); // User-Modell für Benutzerdaten
const Expense = require("../models/expenseModel"); // Expense-Modell für Ausgaben
const catchAsync = require("./../utils/catchAsync"); // catchAsync für Fehlerbehandlung bei asynchronen Funktionen
const AppError = require("./../utils/appError"); // AppError-Klasse für Fehlerbehandlung
const jwt = require("jsonwebtoken"); // JSON Web Token für Authentifizierung
const { validateToken } = require("./../utils/auth/jwtAuthenticator"); // Token-Validierung

// Funktion zum Erstellen einer neuen Gruppe
exports.createGroup = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Extrahiere das JWT aus dem Authorization-Header
  let { success, data } = validateToken(token); // Überprüfe das Token

  console.log("Success: ", success); // Debugging-Ausgabe

  if (!success) {
    return next(new AppError("Unauthorized", 401)); // Wenn Token ungültig, Fehler zurückgeben
  }

  const { groupName, groupMembers } = req.body; // Extrahiere Gruppenname und Mitglieder aus dem Anfragetext

  if (!groupName || !groupMembers) {
    return next(new AppError("Please provide all required fields", 400)); // Fehlermeldung bei fehlenden Feldern
  }

  const newGroup = await Group.create({
    groupName, // Erstelle eine neue Gruppe mit dem angegebenen Namen
  });

  for (const username of groupMembers) {
    const user = await User.findOne({ username }); // Finde jeden Benutzer anhand des Benutzernamens
    if (user !== null && user !== undefined) {
      user.groups.push(newGroup._id); // Füge die Gruppen-ID zur Benutzergruppe hinzu
      newGroup.groupMembers.push(user._id); // Füge die Benutzer-ID zur Gruppenzugehörigkeit hinzu
      await user.save(); // Speichere den Benutzer
    } else {
      res.status(400).json({
        status: "fail",
        data: {
          username: username,
          groupid: newGroup._id,
        },
      });
    }
  }
  await newGroup.save(); // Speichere die neue Gruppe

  res.status(201).json({
    status: "success",
    data: {
      group: newGroup, // Sende die neu erstellte Gruppe als Antwort zurück
    },
  });
});

// Funktion zum Abrufen der Gruppen eines Benutzers
exports.getGroups = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]; // Extrahiere das JWT aus dem Authorization-Header
  let { success, data } = validateToken(token); // Überprüfe das Token

  if (!success) {
    return next(new AppError("Unauthorized", 401)); // Wenn Token ungültig, Fehler zurückgeben
  }

  const userId = new mongoose.Types.ObjectId(data.id); // Konvertiere die ID in ein Mongoose-Objekt
  const user = await User.findById(userId)
    .populate("groups") // Populiere die Gruppen des Benutzers
    .populate({
      path: "groupMembers",
      select: "username", // Nur den Benutzernamen der Gruppenmitglieder zurückgeben
      options: { strictPopulate: false },
    });

  // Formatieren der Gruppen mit den Mitgliedern und ihren Benutzernamen
  const formattedGroups = await Promise.all(
    user.groups.map(async (group) => {
      const groupMembers = await Promise.all(
        group.groupMembers.map(async (member) => {
          const user = await User.findById(member); // Finde jedes Gruppenmitglied
          return {
            _id: user._id,
            username: user.username, // Gebe die Benutzer-ID und den Benutzernamen zurück
          };
        })
      );
      return {
        id: group._id,
        groupName: group.groupName,
        groupMembers, // Füge die formatierten Gruppenmitglieder hinzu
      };
    })
  );

  res.status(201).json({
    status: "success",
    data: {
      username: user.username, // Gebe den Benutzernamen und die formatierten Gruppen zurück
      groups: formattedGroups,
    },
  });
});

// Funktion zur Validierung von Benutzern
exports.validateUsers = async (req, res, next) => {
  const { users } = req.body; // Extrahiere die Benutzernamen aus dem Anfragetext
  const invalidUsers = [];

  for (const username of users) {
    const user = await User.findOne({ username }); // Finde jeden Benutzer anhand des Benutzernamens

    if (!user) {
      invalidUsers.push(username); // Füge ungültige Benutzer zum Array hinzu
    }
  }

  if (invalidUsers.length > 0) {
    return res.status(400).json({
      status: "fail",
      allUsersValid: false,
      message: "Ein oder mehrere Member sind ungültig.", // Fehlermeldung bei ungültigen Benutzern
    });
  }

  return res.status(200).json({
    status: "success",
    allUsersValid: true, // Erfolgreiche Validierung
  });
};

// Funktion zum Abrufen einer Gruppe nach ID
exports.getGroupById = async (req, res) => {
  try {
    const id = req.params.id; // Extrahiere die Gruppen-ID aus den Anfrageparametern
    const group = await Group.findById(id).populate("groupMembers"); // Finde die Gruppe und populiere die Mitglieder

    if (!group) {
      return res.status(404).send("Group not found"); // Fehlermeldung bei nicht gefundener Gruppe
    }

    // Erstelle ein Array mit den Nutzern und ihren Balances
    const membersWithBalances = group.groupMembers.map((member) => {
      return {
        member,
        balance: group.balances.get(member._id.toString()) || 0, // Gebe das Guthaben der Mitglieder zurück
      };
    });

    // Füge die Mitglieder mit Balances zu den Gruppendetails hinzu
    const groupDetails = {
      ...group.toObject(),
      membersWithBalances, // Füge die formatierten Balances hinzu
    };

    res.json(groupDetails); // Sende die Gruppendetails als JSON zurück
  } catch (error) {
    console.log("ERROR: ", error); // Fehlerbehandlung und Ausgabe von Fehlern
    res.status(500).send("Server Error"); // Fehlermeldung bei Serverfehler
  }
};

// Funktion zum Hinzufügen einer neuen Ausgabe
exports.addNewExpense = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Extrahiere das JWT aus dem Authorization-Header
  let { success, data } = validateToken(token); // Überprüfe das Token

  if (!success) {
    return next(new AppError("Unauthorized", 401)); // Wenn Token ungültig, Fehler zurückgeben
  }

  const groupId = req.params.id; // Extrahiere die Gruppen-ID aus den Anfrageparametern
  const { description, amount } = req.body; // Extrahiere die Beschreibung und den Betrag der Ausgabe

  const paidBy = data.id; // Setze die ID des zahlenden Nutzers

  try {
    const group = await Group.findById(groupId).populate("groupMembers"); // Finde die Gruppe und populiere die Mitglieder

    if (!group) {
      return res.status(404).send("Group not found"); // Fehlermeldung bei nicht gefundener Gruppe
    }

    const expense = new Expense({
      description, // Beschreibung der Ausgabe
      amount, // Betrag der Ausgabe
      group: groupId, // Zugehörige Gruppen-ID
      paidBy, // Bezahlt von
    });

    await expense.save(); // Speichere die Ausgabe

    const splitAmount = amount / group.groupMembers.length; // Teile den Betrag durch die Anzahl der Mitglieder

    group.groupMembers.forEach((member) => {
      if (member._id.toString() === paidBy.toString()) {
        group.balances.set(
          member._id.toString(),
          (group.balances.get(member._id.toString()) || 0) +
            amount -
            splitAmount // Aktualisiere das Guthaben des zahlenden Nutzers
        );
      } else {
        group.balances.set(
          member._id.toString(),
          (group.balances.get(member._id.toString()) || 0) - splitAmount // Aktualisiere das Guthaben der anderen Mitglieder
        );
      }
    });

    await group.save(); // Speichere die Gruppe mit aktualisierten Balances

    // WebSocket-Benachrichtigung
    const wss = req.app.get("wss"); // Zugriff auf den WebSocket-Server
    if (wss) {
      const updatedBalances = group.groupMembers.map((member) => ({
        username: member.username, // Gebe den Benutzernamen zurück
        balance: group.balances.get(member._id.toString()) || 0, // Gebe das aktualisierte Guthaben zurück
      }));

      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.groupId === groupId // Überprüfe, ob der Client verbunden und Teil der Gruppe ist
        ) {
          client.send(
            JSON.stringify({
              type: "updateBalances", // Nachrichtentyp "updateBalances"
              balances: updatedBalances, // Aktualisierte Guthaben
              expense: {
                description: expense.description, // Beschreibung der Ausgabe
                amount: expense.amount, // Betrag der Ausgabe
              },
            })
          );
        }
      });
    } else {
      console.log("WebSocket server not initialized"); // Fehlerbehandlung, wenn der WebSocket-Server nicht initialisiert ist
    }

    res.status(201).json(expense); // Sende die Ausgabe als Antwort zurück
  } catch (error) {
    console.log("ERROR: ", error); // Fehlerbehandlung und Ausgabe von Fehlern
    res.status(500).send("Server Error"); // Fehlermeldung bei Serverfehler
  }
};
