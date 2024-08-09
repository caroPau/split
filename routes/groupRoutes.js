const express = require("express");
const groupController = require("./../controllers/groupController");

const router = express.Router();

router.post("/newGroup/create", groupController.createGroup);
router.get("/", groupController.getGroups);

module.exports = router;
