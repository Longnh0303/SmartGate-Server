const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const userService = require("./user.service");

const getAccount = async (userId) => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Người dùng không tồn tại!");
  }

  return user;
};

module.exports = {
  getAccount,
};
