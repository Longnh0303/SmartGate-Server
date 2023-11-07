const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const httpStatus = require("http-status");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : null;
  if (!token)
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Xin hãy xác thực" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new Error();
    next();
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({ message: "Token không hợp lệ" });
  }
};
