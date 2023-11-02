const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const httpStatus = require("http-status");

const login = async (req, res) => {
  const { email, password } = req.body;

  // Tìm người dùng bằng email
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Người dùng không tồn tại!" });
  }

  // So sánh mật khẩu
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Tài khoản hoặc mật khẩu không chính xác" });
  }

  // Tạo JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  res.json({ message: "Đăng nhập thành công", user, token });
};

const logout = (req, res) => {
  return res.status(httpStatus.OK).json({ message: "Đăng xuất thành công" });
};

module.exports = {
  login,
  logout,
};
