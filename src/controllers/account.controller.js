const catchAsync = require("../utils/catchAsync");
const { accountService } = require("../services");

const getAccount = catchAsync(async (req, res) => {
  const user = await accountService.getAccount(req.user._id);
  res.send(user);
});

module.exports = {
  getAccount,
};
