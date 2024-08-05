const Group = require("./../models/groupModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

exports.createGroup = catchAsync(async (req, res, next) => {
  //TODO jwt überprüfen, dann rest ausführen

  const token = req.headers.authorization.split(" ")[1];
  let { success, data } = validateToken(token);

  if (!success) {
    return next(new AppError("Please provide all required fields", 401));
  }

  const { groupName, groupMembers } = req.body;

  if (!groupName || !groupMembers) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const newGroup = await Group.create({
    groupName,
    groupMembers,
  });

  res.status(201).json({
    status: "success",
    data: {
      group: newGroup,
    },
  });
});
