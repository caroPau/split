// Importiere notwendige Module
const express = require("express");
const path = require("path");
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");

// Erstelle eine Express-Anwendung
const app = express();

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "public"))); // Statische Dateien im "public" Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, "views"))); // Statische Dateien im "views" Verzeichnis bereitstellen
app.use(express.static(path.join(__dirname, "utils", "img"))); // Statische Bilder im "utils/img" Verzeichnis bereitstellen

// Route für die Startseite
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "hello.html")); // Sendet die "hello.html"-Datei bei GET-Anfrage an "/"
});

// Route für die Gruppenübersicht
app.get("/groups", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "groups.html")); // Sendet die "groups.html"-Datei bei GET-Anfrage an "/groups"
});

// Route für das Erstellen einer neuen Gruppe
app.get("/groups/newGroup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addGroup.html")); // Sendet die "addGroup.html"-Datei bei GET-Anfrage an "/groups/newGroup"
});

// Route für die Gruppendetails
app.get("/groups/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "group.html")); // Sendet die "group.html"-Datei bei GET-Anfrage an "/groups/:id"
});

// Route für die Ausgaben einer Gruppe
app.get("/groups/:id/expenses", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "expenses.html")); // Sendet die "expenses.html"-Datei bei GET-Anfrage an "/groups/:id/expenses"
});

// Route für die Abmeldung
app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "logout.html")); // Sendet die "logout.html"-Datei bei GET-Anfrage an "/logout"
});

// Body-Parser, liest JSON-Daten aus dem Anfragekörper
app.use(express.json({ limit: "10kb" })); // Beschränkt die Größe der JSON-Nachricht auf 10KB

// Test-Middleware, fügt die Anfragezeit zur Anfrage hinzu
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // Fügt das aktuelle Datum und die Uhrzeit zur Anfrage hinzu
  next(); // Übergibt die Anfrage an die nächste Middleware
});

// ROUTES
app.use("/api/v1/expenses", expenseRouter); // Verwendet den expenseRouter für Anfragen an "/api/v1/expenses"
app.use("/api/v1/users", userRouter); // Verwendet den userRouter für Anfragen an "/api/v1/users"
app.use("/api/v1/groups", groupRouter); // Verwendet den groupRouter für Anfragen an "/api/v1/groups"

// Fange alle nicht definierten Routen ab und erstelle einen Fehler
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Exportiere die Express-Anwendung
module.exports = app; // Exportiert die Express-Anwendung
