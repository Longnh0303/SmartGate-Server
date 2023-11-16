const express = require("express");
const router = express.Router();
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");
const { deviceController } = require("../controllers");

// Middleware that applies to all routes except GET
router.use((req, res, next) => {
  if (req.method !== 'GET') {
    verifyToken(req, res, next);
    authorize(["manager"])(req, res, next);
  } else {
    next();
  }
});

router
  .route("/")
  .get(deviceController.getDevices) // No authorization middleware for GET
  .post(deviceController.createDevice);

router
  .route("/:id")
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

module.exports = router;
