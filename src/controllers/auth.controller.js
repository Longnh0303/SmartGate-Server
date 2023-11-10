const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { authService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password);

  // Tạo JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiration + "d",
  });

  res.json({ message: "Đăng nhập thành công", user, token });
});

const logout = (_req, res) => {
  return res
    .status(httpStatus.NO_CONTENT)
    .send({ message: "Đăng xuất thành công" });
};

module.exports = {
  login,
  logout,
};
