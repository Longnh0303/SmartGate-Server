const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");
const { deviceController } = require("../controllers");

// Middleware that applies to all routes
router.use(verifyToken, authorize(["manager"]));

router
  .route("/")
  .get(deviceController.getDevices)
  .post(deviceController.createDevice);

router
  .route("/:id")
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

module.exports = router;
