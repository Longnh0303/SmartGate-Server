const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

router.post(
  "/",
  verifyToken,
  authorize(["manager"]),
  userController.createUser
);

router.get(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  userController.getUserByID
);

router.get("/", verifyToken, authorize(["manager"]), userController.getUsers);

router.patch(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  userController.updateUser
);

router.delete(
  "/:id",
  verifyToken,
  authorize(["manager"]),
  userController.deleteUser
);

module.exports = router;
