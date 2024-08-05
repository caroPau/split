const express = require("express");
const groupController = require("./../controllers/groupController");

const router = express.Router();

router.post("/newGroup/create", groupController.createGroup);

module.exports = router;
