const mongoose = require("mongoose");
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

exports.getGroups = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let { success, data } = validateToken(token);

  if (!success) {
    return next(new AppError("Unauthorized", 401));
  }

  const userId = new mongoose.Types.ObjectId(data.id);
  const user = await User.findById(userId)
    .populate("groups")
    .populate({
      path: "groupMembers",
      select: "username", // Nur das Namensfeld der groupMembers zurückgeben
      options: { strictPopulate: false },
    });

  const formattedGroups = await Promise.all(
    user.groups.map(async (group) => {
      const groupMembers = await Promise.all(
        group.groupMembers.map(async (member) => {
          const user = await User.findById(member);
          return {
            _id: user._id,
            username: user.username,
          };
        })
      );
      return {
        groupName: group.groupName,
        groupMembers,
      };
    })
  );

  res.status(201).json({
    status: "success",
    data: {
      username: user.username,
      groups: formattedGroups,
    },
  });
});
