const mongoose = require("mongoose");
// const User = require("./userModel");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Please provide a groupname"],
  },
  groupMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  balances: {
    type: Map,
    of: Number,
    default: {},
  },
});

const Group = mongoose.model("Group", groupSchema);

// Exportiere das Group-Modell
module.exports = Group;
