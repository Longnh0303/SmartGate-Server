const express = require("express");
const router = express.Router();
const rfidController = require("../controllers/rfid.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

router.post(
    "/",
    verifyToken,
    authorize(["manager"]),
    rfidController.createRfid
  );

  
router.get(
  "/card/:cardId",
  verifyToken,
  rfidController.getCardById
);

router.patch(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  rfidController.updateRfid
);

router.get("/", verifyToken, authorize(["manager"]), rfidController.getRfids);

router.delete(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  rfidController.deleteRfid
);

module.exports = router;