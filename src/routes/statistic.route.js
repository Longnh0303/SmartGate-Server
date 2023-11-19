const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statistic.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/access", verifyToken, statisticController.getAccessStats);

module.exports = router;
