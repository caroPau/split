const mongoose = require("mongoose");
// const User = require("./userModel");

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, "Please provide a groupname"],
    unique: true, // Muss eindeutig sein
  },
  groupMembers: [
    {
      type: mongoose.Schema.Types.Array,
      ref: "User",
      unique: false,
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

// Exportiere das Group-Modell
module.exports = Group;
