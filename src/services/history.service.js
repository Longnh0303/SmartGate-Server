const { History } = require("../models");

const getHistory = async () => {
  const result = await History.find();
  return result;
};

module.exports = {
  getHistory,
};
