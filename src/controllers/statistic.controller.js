const { History } = require("../models");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { statisticService } = require("../services");

const getAccessStats = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getAccessStats(timeRange);
  return res.send(results);
});

const getTotalMoney = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getTotalMoney(timeRange);
  return res.send(results);
});

const getAutoMoney = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getAutoMoney(timeRange);
  return res.send(results);
});

const getManualMoney = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getManualMoney(timeRange);
  return res.send(results);
});

const getVehicle = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getVehicle(timeRange);
  return res.send(results);
});

const getColumnChartData = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getColumnChartData(timeRange);
  return res.send(results);
});

const getPieChartData = catchAsync(async (req, res, _next) => {
  const { timeRange } = req.query;
  const results = await statisticService.getPieChartData(timeRange);
  return res.send(results);
});

module.exports = {
  getAccessStats,
  getTotalMoney,
  getAutoMoney,
  getManualMoney,
  getVehicle,
  getColumnChartData,
  getPieChartData,
};
