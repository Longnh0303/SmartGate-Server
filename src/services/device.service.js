const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Device } = require("../models");

const createDevice = async (deviceBody) => {
  if (await Device.isDeviceExisted(deviceBody.mac)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Thiết bị đã tồn tại");
  }
  return Device.create(deviceBody);
};

const getDevices = async () => {
  const result = await Device.find();
  return result;
};

const getDeviceById = async (id) => {
  return Device.findById(id);
};

const deleteDeviceById = async (id) => {
  const device = await getDeviceById(id);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thiết bị");
  }
  await device.deleteOne();
  return device;
};

const updateDeviceById = async (id, updateBody) => {
  const device = await getDeviceById(id);
  if (!device)
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thiết bị");

  // Kiểm tra nếu ther đã tồn tại
  if (updateBody.mac) {
    if (await Device.isDeviceExisted(updateBody.mac, id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Thiết bị đã tồn tại");
    }

    Device.mac = updateBody.mac;
  }

  Object.assign(device, updateBody);

  await device.save();
  return device;
};

const findDeviceByMac = async (mac) => {
  return await Device.findOne({ mac });
};

module.exports = {
  createDevice,
  getDevices,
  deleteDeviceById,
  updateDeviceById,
  findDeviceByMac
};
