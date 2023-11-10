const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { accountController } = require("../controllers");

const router = express.Router();

router.use(verifyToken);

// Get & update profile
router.route("/").get(accountController.getAccount);

module.exports = router;
