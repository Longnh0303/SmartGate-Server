const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const configs = require("../config/config");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email đã tồn tại");
  }
  return User.create(userBody);
};

const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy người dùng");

  // Kiểm tra nếu email đã tồn tại
  if (updateBody.email) {
    if (await User.isEmailTaken(updateBody.email, userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email đã tồn tại");
    }

    user.email = updateBody.email;
  }

  Object.assign(user, updateBody);

  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy người dùng");
  }
  await user.deleteOne();
  return user;
};

const createAdmin = async () => {
  if (await User.isEmailTaken(configs.admin.email)) {
    logger.info(`Existed account ${configs.admin.email}`);
    return;
  }
  logger.info(`Created account ${configs.admin.email}`);
  return User.create(configs.admin);
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createAdmin,
};
