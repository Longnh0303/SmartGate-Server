const User = require("../models/user.model");
const httpStatus = require("http-status");

// Create a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra định dạng email bằng regex
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email.match(emailRegex)) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Invalid email format" });
  }

  // Kiểm tra xem email đã được sử dụng chưa
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "Email already in use" });
  }

  const user = new User({ username, email, password });
  await user.save();
  res
    .status(httpStatus.CREATED)
    .json({ message: "User created successfully", user });
};

// Get user by ID
const getUserByID = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
  }

  res.json(user);
};

// Get all users
const getUsers = async (req, res, next) => {
  try {
    // Lấy role từ query params. Nếu không có sẽ mặc định là null (lấy tất cả)
    let userRole = null;
    if (typeof req.query.role !== "undefined") {
      userRole =
        req.query.role === "manager"
          ? "manager"
          : req.query.role === "operator"
          ? "operator"
          : null;
    }

    // Thiết lập các thông số phân trang từ query params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Tạo filter dựa trên role
    const filter = userRole !== null ? { role: userRole } : {};

    // Giả định bạn có một model tên là User. Sử dụng mongoose-paginate để lấy dữ liệu
    const users = await User.paginate(filter, {
      page,
      limit,
    });

    return res.status(httpStatus.OK).json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to fetch users" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  // Tìm user cần cập nhật
  const user = await User.findById(id);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
  }

  // Kiểm tra xem người gửi request có vai trò admin hay không
  const isAdmin = req.user && req.user.role === "manager";

  // Kiểm tra xem người gửi request có phải chính user đó hay không
  const isUser = req.user && req.user._id.toString() === user._id.toString();

  if (isAdmin) {
    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail && String(existingUserWithEmail._id) !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Kiểm tra định dạng email bằng regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(emailRegex)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Invalid email format" });
      }
    }

    // Cập nhật các trường nếu được cung cấp
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } else if (isUser) {
    if (email) {
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail && String(existingUserWithEmail._id) !== id) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Kiểm tra định dạng email bằng regex
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(emailRegex)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Invalid email format" });
      }
    }
  } else {
    // Người dùng không có quyền cập nhật
    res.status(httpStatus.FORBIDDEN).json({ message: "Access denied" });
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
        .json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};
module.exports = {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
