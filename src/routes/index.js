const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const rfidRoute = require("./rfid.route")

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/rfid",
    route: rfidRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
