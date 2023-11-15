const { Device } = require("../models");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { deviceService } = require("../services");

// Create a new device
const createDevice = catchAsync(async (req, res) => {
  const Device = await deviceService.createDevice(req.body);
  res.status(httpStatus.CREATED).send(Device);
});

// Get device
const getDevices = catchAsync(async (req, res, _next) => {
  results = await deviceService.getDevices();
  return res.send(results);
});

// Delete device by ID
const deleteDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const device = await deviceService.deleteDeviceById(id);
  res.send(device);
});

// Update device
const updateDevice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateDevice = await deviceService.updateDeviceById(id, req.body);
  res.send(updateDevice);
});

module.exports = {
  createDevice,
  getDevices,
  deleteDevice,
  updateDevice,
};
