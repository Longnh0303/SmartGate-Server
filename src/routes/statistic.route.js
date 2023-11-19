const express = require("express");
const router = express.Router();
const statisticController = require("../controllers/statistic.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/access", verifyToken, statisticController.getAccessStats);

router.get("/money/total", verifyToken, statisticController.getTotalMoney);

router.get("/money/auto", verifyToken, statisticController.getAutoMoney);

router.get("/money/manual", verifyToken, statisticController.getManualMoney);

router.get("/vehicle", verifyToken, statisticController.getVehicle);

module.exports = router;
