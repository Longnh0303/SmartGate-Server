const { History } = require("../models");

const getHistory = async () => {
  const result = await History.find().sort({ time_check_in: -1 });
  return result;
};

module.exports = {
  getHistory,
};
