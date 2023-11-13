const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { historyController } = require("../controllers");

// Middleware that applies to all routes
router.use(verifyToken);

router.route("/").get(historyController.getHistory);

module.exports = router;
