const express = require("express");
const { authController } = require("../controllers");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
