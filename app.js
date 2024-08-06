// Importiere notwendige Module
const express = require("express");
const fs = require("fs");
const path = require("path");

// const rateLimit = require("express-rate-limit");
// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
// const hpp = require("hpp");

const AppError = require("./utils/appError");
// const globalErrorHandler = require("./controllers/errorController");
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");

// Erstelle eine Express-Anwendung
const app = express();
// Root route to serve hello.html
// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "hello.html"));
});

app.get("/groups", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "groups.html"))
})

app.get("/groups/newGroup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addGroup.html"));
})

// // GLOBALE MIDDLEWARE

// // Setze Sicherheits-HTTP-Header mit Helmet
// app.use(helmet());

// // Begrenze die Anzahl der Anfragen von derselben IP
// const limiter = rateLimit({
//   max: 100, // Maximal 100 Anfragen
//   windowMs: 60 * 60 * 1000, // Pro Stunde
//   message: "Too many requests from this IP, please try again in an hour!", // Fehlermeldung bei Überschreitung
// });
// app.use("/api", limiter);

// // Body-Parser, liest JSON-Daten aus dem Anfragekörper
app.use(express.json({ limit: "10kb" }));

// // Datenbereinigung gegen NoSQL-Injection
// app.use(mongoSanitize());

// // Datenbereinigung gegen XSS (Cross-Site Scripting)
// app.use(xss());

// // Verhindere Parameterverunreinigung
// app.use(
//   hpp({
//     whitelist: [
//       "amount",
//       "category",
//       "date",
//       "description",
//       "splitWith",
//       "settled",
//     ], // Erlaube diese Parameter mehrfach
//   })
// );

// // Statische Dateien aus dem public-Verzeichnis bereitstellen
// app.use(express.static(`${__dirname}/public`));

// Test-Middleware, fügt die Anfragezeit zur Anfrage hinzu
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES

// const tours = JSON.parse(fs.readFileSync("./utils/data/groups.json", "utf-8"));

// app.get("/api/v1/tours", (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });

// app.post("/api/v1/tours", (req, res) => {
//   console.log(req.body);
//   res.send("Post klappt auch! 😀");
// });

// Benutze die Routen für Expenses und Users
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/groups", groupRouter);

// Fange alle nicht definierten Routen ab und erstelle einen Fehler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// // Globale Fehlerbehandlungs-Middleware
// app.use(globalErrorHandler);

// Exportiere die Express-Anwendung
module.exports = app;
