const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");
const { rfidController } = require("../controllers");

// Middleware that applies to all routes
router.use(verifyToken, authorize(["manager"]));

router.route("/").get(rfidController.getRfids).post(rfidController.createRfid);

router
  .route("/:id")
  .get(rfidController.getRfidByID)
  .patch(rfidController.updateRfid)
  .delete(rfidController.deleteRfid);

router.route("/card/:cardId").get(rfidController.getRfidByCardId);

module.exports = router;
