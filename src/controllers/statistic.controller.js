const { History } = require("../models");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { statisticService } = require("../services");

// Get device
const getAccessStats = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query; // Đảm bảo bạn đang truyền tham số từ URL vào đây
  const results = await statisticService.getAccessStats(timeRange);
  return res.send(results);
});

module.exports = {
  getAccessStats,
};
