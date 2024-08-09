const express = require("express");
const groupController = require("./../controllers/groupController");

const router = express.Router();

router.post("/newGroup/create", groupController.createGroup);
router.post("/validate", groupController.validateUsers);
router.get("/", groupController.getGroups);

module.exports = router;
