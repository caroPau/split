const Group = require("./../models/groupModel");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./../utils/auth/jwtAuthenticator");

exports.createGroup = catchAsync(async (req, res, next) => {
  //TODO jwt überprüfen, dann rest ausführen

  const token = req.headers.authorization.split(" ")[1];
  let { success, data } = validateToken(token);

  console.log("Success: ", success);
  if (!success) {
    return next(new AppError("Unauthorized", 401));
  }

  const { groupName, groupMembers } = req.body;

  console.log("Users to add: ", groupMembers);

  if (!groupName || !groupMembers) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const newGroup = await Group.create({
    groupName,
  });

  for (const username of groupMembers) {
    const user = await User.findOne({ username });
    if (user !== null && user !== undefined) {
      user.groups.push(newGroup._id);
      newGroup.groupMembers.push(user._id);
      await user.save();
    }
  }

  await newGroup.save();

  res.status(201).json({
    status: "success",
    data: {
      group: newGroup,
    },
  });
});
