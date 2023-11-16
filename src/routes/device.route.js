const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");
const { deviceController } = require("../controllers");

router.post(
  "/",
  verifyToken,
  authorize(["manager"]),
  deviceController.createDevice
);

router.get("/", verifyToken, deviceController.getDevices);


router.patch(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  deviceController.updateDevice
);


router.delete(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  deviceController.deleteDevice
);

module.exports = router;
