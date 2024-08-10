const express = require("express");
const groupController = require("../controllers/groupController");

const router = express.Router();

router.post("/newGroup/create", groupController.createGroup);
router.post("/validate", groupController.validateUsers);
router.get("/", groupController.getGroups);
router.get("/:id", groupController.getGroupById);
router.post("/:id/expenses", groupController.addNewExpense);

module.exports = router;
