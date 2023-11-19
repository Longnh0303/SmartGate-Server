const dayjs = require("dayjs");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const getTimeRange = (timeRange) => {
  let fromDate, toDate;

  if (timeRange === "daily") {
    fromDate = dayjs().startOf("day").toDate();
    toDate = dayjs().endOf("day").toDate();
  } else if (timeRange === "monthly") {
    fromDate = dayjs().startOf("month").toDate();
    toDate = dayjs().endOf("month").toDate();
  } else if (timeRange === "alltime") {
    // No need to set fromDate and toDate for all time stats
    // They will remain undefined for this case
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Thời gian không hợp lệ");
  }

  return { fromDate, toDate };
};

module.exports = getTimeRange;
