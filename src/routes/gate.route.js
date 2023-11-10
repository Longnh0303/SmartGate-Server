const express = require("express");
const router = express.Router();
const { gateController } = require("../controllers");

router.route("/").post(gateController.checkCardAndPayment);

module.exports = router;
