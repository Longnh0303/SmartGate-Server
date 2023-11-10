const { Rfid } = require("../models");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { rfidService } = require("../services");

// Create a new Rfid
const createRfid = catchAsync(async (req, res) => {
  const rfid = await rfidService.createRfid(req.body);
  res.status(httpStatus.CREATED).send(rfid);
});

// Get RFIDs
const getRfids = catchAsync(async (req, res, _next) => {
  const { searchTerm } = req.query;
  let results;
  // Kiểm tra xem searchTerm có được cung cấp hay không
  if (!searchTerm) {
    results = await Rfid.find();
  } else {
    // Sử dụng RegExp để tạo mẫu tìm kiếm không phân biệt hoa thường
    const searchPattern = new RegExp(searchTerm, "i");

    // Tìm các RFID có trường "name" trong "userInfo" chứa chuỗi tìm kiếm
    results = await Rfid.find({
      name: searchPattern,
    });
  }
  return res.send(results);
});

// Get rfid by id
const getRfidByID = catchAsync(async (req, res) => {
  const { id } = req.params;
  const rfid = await rfidService.getRfidById(id);
  res.send(rfid);
});

// Update rfid
const updateRfid = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedRfid = await rfidService.updateRfidById(id, req.body);
  res.send(updatedRfid);
});

// Delete rfid by ID
const deleteRfid = catchAsync(async (req, res) => {
  const { id } = req.params;
  const rfid = await rfidService.deleteRfidById(id);
  res.send(rfid);
});

module.exports = {
  createRfid,
  getRfids,
  getRfidByID,
  updateRfid,
  deleteRfid,
};
