const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authorize = require("../middlewares/authorize");
const verifyToken = require("../middlewares/verifyToken");

// Middleware that applies to all routes
router.use(verifyToken, authorize(["manager"]));

router.route("/")
  .post(userController.createUser)
  .get(userController.getUsers);

router.route("/:id")
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
