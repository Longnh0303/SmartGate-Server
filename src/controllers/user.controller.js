const User = require("../models/user.model");
const httpStatus = require("http-status");

// Create a new user
const createUser = async (req, res) => {
  const { username, email, phone, password } = req.body;

  // Kiểm tra định dạng email bằng regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email.match(emailRegex)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email không hợp lệ" });
  }

  // Kiểm tra xem email đã được sử dụng chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email đã tồn tại trong hệ thống" });
  }

  const user = new User({ username, email, phone, password });
  await user.save();
  res
    .status(httpStatus.CREATED)
    .json({ message: "Tạo người dùng mới thành công", user });
};

// Get user by ID
const getUserByID = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Người dùng không tồn tại" });
  }

  res.json(user);
};

const getUsers = async (req, res, next) => {
  try {
    const { searchTerm } = req.query;

    // Kiểm tra xem searchTerm có được cung cấp hay không
    if (!searchTerm) {
      const users = await User.find();
      const response = users.map((user) => ({ ...user._doc, id: user._id }));
      return res.status(httpStatus.OK).json(response);
    } else {
      // Sử dụng RegExp để tạo mẫu tìm kiếm không phân biệt hoa thường
      const searchPattern = new RegExp(searchTerm, "i");

      // Tìm các người dùng có tên chứa chuỗi tìm kiếm
      const users = await User.find({ username: searchPattern });
      const response = users.map((user) => ({ ...user._doc, id: user._id }));
      return res.status(httpStatus.OK).json(response);
    }
  } catch (error) {
    console.error("Yêu cầu thất bại:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Yêu cầu thất bại" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, phone, role } = req.body;

  // Tìm user cần cập nhật
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json({ message: "Người dùng không tồn tại" });
  }

  // Kiểm tra xem người gửi request có vai trò manager hay không
  const isAdmin = req.user && req.user.role === "manager";
  if (isAdmin) {
    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail && String(existingUserWithEmail._id) !== id) {
        return res
          .status(400)
          .json({ message: "Email đã tồn tại trong hệ thống" });
      }

      // Kiểm tra định dạng email bằng regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(emailRegex)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Email không hợp lệ" });
      }
    }

    // Cập nhật các trường nếu được cung cấp
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();
    res.json({ message: "Cập nhật người dùng thành công", user });
  } else {
    // Người dùng không có quyền cập nhật
    res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Bạn không có quyền cập nhật thông tin" });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Now delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại" });
    }

    res.json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Yêu cầu thất bại:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Kết nối đến máy chủ thất bại" });
  }
};
module.exports = {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
