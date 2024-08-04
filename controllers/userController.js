// Importiere das User-Modell, catchAsync und AppError
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Funktion zum Filtern von Objekten nach erlaubten Feldern
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Controller zum Abrufen aller Benutzer
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Sende die Antwort
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Controller zum Aktualisieren des aktuellen Benutzers
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Erstelle einen Fehler, wenn der Benutzer Passwortdaten postet
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtere unerwünschte Feldnamen heraus, die nicht aktualisiert werden dürfen
  const filteredBody = filterObj(req.body, "username");

  // 3) Aktualisiere das Benutzerdokument
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // Gibt das aktualisierte Dokument zurück
    runValidators: true, // Überprüft die Validierung beim Aktualisieren
  });

  // Sende die Antwort
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Controller zum Deaktivieren des aktuellen Benutzers (soft delete)
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // Sende die Antwort
  res.status(204).json({
    status: "success",
    data: null, // Keine Daten zurückgeben
  });
});

// Controller zum Abrufen eines Benutzers (noch nicht definiert)
exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

// Controller zum Erstellen eines Benutzers (noch nicht definiert)
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

// Controller zum Aktualisieren eines Benutzers (noch nicht definiert)
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

// Controller zum Löschen eines Benutzers (noch nicht definiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
