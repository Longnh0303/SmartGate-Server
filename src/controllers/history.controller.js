const { History } = require("../models");
const { historyService } = require("../services");
const catchAsync = require("../utils/catchAsync");

// Get RFIDs
const getHistory = catchAsync(async (req, res, _next) => {
  const { searchTerm } = req.query;
  let results;
  // Kiểm tra xem searchTerm có được cung cấp hay không
  if (!searchTerm) {
    results = await historyService.getHistory();
  } else {
    // Sử dụng RegExp để tạo mẫu tìm kiếm không phân biệt hoa thường
    const searchPattern = new RegExp(searchTerm, "i");

    // Tìm các RFID có trường "name" trong "userInfo" chứa chuỗi tìm kiếm
    results = await History.find({
      name: searchPattern,
    });
  }
  return res.send(results);
});
module.exports = {
  getHistory,
};
