const mongoose = require("mongoose");
const WebSocket = require("ws");
const Group = require("./../models/groupModel");
const User = require("../models/userModel");
const Expense = require("../models/expenseModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const { validateToken } = require("./../utils/auth/jwtAuthenticator");

exports.createGroup = catchAsync(async (req, res, next) => {
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
        id: group._id,
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

exports.validateUsers = async (req, res, next) => {
  const { users } = req.body;
  const invalidUsers = [];

  for (const username of users) {
    const user = await User.findOne({ username });

    if (!user) {
      invalidUsers.push(username);
    }
  }

  if (invalidUsers.length > 0) {
    return res.status(400).json({
      status: "fail",
      allUsersValid: false,
      message: "Ein oder mehrere Member sind ungültig.",
    });
  }

  return res.status(200).json({
    status: "success",
    allUsersValid: true,
  });
};

exports.getGroupById = async (req, res) => {
  try {
    const id = req.params.id;
    const group = await Group.findById(id).populate("groupMembers");

    if (!group) {
      return res.status(404).send("Group not found");
    }

    // Erstelle ein Array mit den Nutzern und ihren Balances
    const membersWithBalances = group.groupMembers.map((member) => {
      return {
        member,
        balance: group.balances.get(member._id.toString()) || 0,
      };
    });

    // Füge die Mitglieder mit Balances zu den Gruppendetails hinzu
    const groupDetails = {
      ...group.toObject(),
      membersWithBalances,
    };

    res.json(groupDetails); // Sende die Gruppendetails als JSON
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Server Error");
  }
};

exports.addNewExpense = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let { success, data } = validateToken(token);

  if (!success) {
    return next(new AppError("Unauthorized", 401));
  }

  const groupId = req.params.id;
  console.log("BODY: ", req.body);
  const { description, amount } = req.body;

  const paidBy = data.id; // Angenommen, der Nutzer ist authentifiziert und req.user enthält die Nutzerdaten

  try {
    const group = await Group.findById(groupId).populate("groupMembers");

    if (!group) {
      return res.status(404).send("Group not found");
    }

    const expense = new Expense({
      description,
      amount,
      group: groupId,
      paidBy,
    });

    await expense.save();

    const splitAmount = amount / group.groupMembers.length;

    group.groupMembers.forEach((member) => {
      if (member._id.toString() === paidBy.toString()) {
        group.balances.set(
          member._id.toString(),
          (group.balances.get(member._id.toString()) || 0) +
            amount -
            splitAmount
        );
      } else {
        group.balances.set(
          member._id.toString(),
          (group.balances.get(member._id.toString()) || 0) - splitAmount
        );
      }
    });

    await group.save();

    // WebSocket-Benachrichtigung
    const wss = req.app.get("wss");
    if (wss) {
      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.groupId === groupId
        ) {
          client.send(JSON.stringify(expense));
        }
      });
    } else {
      console.log("WebSocket server not initialized");
    }

    res.status(201).json(expense);
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).send("Server Error");
  }
};
