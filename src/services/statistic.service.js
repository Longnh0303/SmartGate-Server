const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { History } = require("../models");
const getTimeRange = require("../utils/day");

const getAccessStats = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  const query = {};

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  const gateInStats = await History.countDocuments(query);
  const gateOutStats = await History.countDocuments({ done: true, ...query });
  const totalAccess = gateInStats + gateOutStats;

  return { gateInStats, gateOutStats, totalAccess };
};

module.exports = { getAccessStats };
