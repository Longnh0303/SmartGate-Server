const catchAsync = require("../utils/catchAsync");
const { gateService } = require("../services");

const checkCardAndPayment = catchAsync(async (req, res, _next) => {
  const result = await gateService.checkCardAndPayment(req.body);
  res.send(result);
});

module.exports = {
  checkCardAndPayment,
};
