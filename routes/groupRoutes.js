const express = require("express");
const groupController = require("./../controllers/groupController");

const router = express.Router();

router.post("/newGroup/create", groupController.createGroup);
router.post("/validate", groupController.validateUsers)


module.exports = router;
