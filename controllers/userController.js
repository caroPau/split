// Importiere das User-Modell, catchAsync und AppError
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { validateToken } = require("./../utils/auth/jwtAuthenticator")

// Controller zum Abrufen aller Benutzer
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // Sende die Antwort
//   res.status(200).json({
//     status: "success",
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// // Controller zum Abrufen eines Benutzers (noch nicht definiert)
// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "This route is not yet defined!",
//   });
// };

exports.register = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // Überprüfen, ob alle erforderlichen Felder vorhanden sind
  if (!username || !password) {
    return next(new AppError("Please provide all required fields", 400));
  }

  // Neuen Benutzer erstellen
  const newUser = await User.create({
    username,
    password,
  });

  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getMyGroups = catchAsync(async(req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if(!token){
    return res.status(401).json({
      status: "fail",
      message:"No token provided"
    });
  }
  const result = validateToken(token);

  if(!result.success){
    return res.status(401).json({
      status: "fail",
      message: "Invalid token."
    });
  }

  const userId = result.data.id;

  const user = await User.findById(userId).populate("groups");

  if(!user){
    return res.status(404).json({
      status:"fail",
      message: "User not found"
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      groups: user.groups,
    }
  });
});

/*exports.findUserByUsername = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  console.log("Username: ", username);

  // Find the user by username
  const user = await User.findOne({ username });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "User does not exist. Cannot login with that username.",
    });
  }
  console.log("Password: " + user.password);

  user
    .correctPassword(password, user.password)
    .then((isMatch) => {
      if (isMatch) {
        console.log("Passwords match");

        // JWT Token erstellen und senden
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN, // Token Ablaufzeit
        });
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        console.log("Passwords do not match");
        return res.status(400).json({
          status: "error",
          message: "Invalid password. Cannot login with that password.",
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});*/

// Controller zum Löschen eines Benutzers (noch nicht definiert)
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
