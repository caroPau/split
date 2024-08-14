// Importiere Mongoose für die MongoDB-Verbindung und dotenv für das Laden von Umgebungsvariablen
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
const WebSocket = require("ws");

// Lade Umgebungsvariablen aus der config.env Datei
dotenv.config({ path: "./config.env" });
// Importiere die Express-App aus der app.js
const app = require("./app");

// Ersetze das Platzhalter-Passwort in der Datenbank-URL mit dem tatsächlichen Passwort aus den Umgebungsvariablen
const DB = "mongodb://127.0.0.1:27017/splitmate";

// Verbinde mit der MongoDB-Datenbank
mongoose.connect(DB, {}).then(() => console.log("DB connection successful!")); // Logge eine Erfolgsmeldung bei erfolgreicher Verbindung

// Definiere den Port, auf dem der Server laufen soll, standardmäßig 3000
const port = process.env.PORT || 3000;
// Starte den Server und höre auf den definierten Port
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// WebSocket-Server auf Port 8080
const wss = new WebSocket.Server({ port: 8080 });
wss.on("connection", (ws, req) => {
  const groupId = req.url.split("/").pop();
  ws.groupId = groupId; // Speichern der groupId im WebSocket-Client
  console.log(`WebSocket connection established for group ${groupId}`);
});

// Speichern der WebSocket-Server-Instanz in der Express-App
app.set("wss", wss);
