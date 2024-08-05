const express = require("express");
const groupController = require("./../controllers/groupController");

const router = express.Router();

router.post("/newGroup", groupController.createGroup);

module.exports = router;
