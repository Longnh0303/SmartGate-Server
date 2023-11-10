const { User } = require("../models");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

// Create a new user
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

// Get user by id
const getUserByID = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.send(user);
});

// Get users
const getUsers = catchAsync(async (req, res) => {
  const { searchTerm } = req.query;
  let result;
  // Kiểm tra xem searchTerm có được cung cấp hay không
  if (!searchTerm) {
    result = await User.find();
  } else {
    // Sử dụng RegExp để tạo mẫu tìm kiếm không phân biệt hoa thường
    const searchPattern = new RegExp(searchTerm, "i");

    // Tìm các người dùng có tên chứa chuỗi tìm kiếm
    result = await User.find({ username: searchPattern });
  }
  return res.send(result);
});

// Update user
const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateUserById(id, req.body);
  res.send(updatedUser);
});

// Delete user by ID
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await userService.deleteUserById(id);
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
};
