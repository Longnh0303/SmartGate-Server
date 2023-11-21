const catchAsync = require("../utils/catchAsync");
const { gateService } = require("../services");
const { sendMessageToRoom } = require("../services/socket.service");

const checkCardAndPayment = catchAsync(async (req, res, _next) => {
  const dataMsg = {
    type: "access",
    data: { cardId: req.body.cardId, time: Date.now() },
  };
  sendMessageToRoom(`${req.body.macAddress}_status`, dataMsg);
  const result = await gateService.checkCardAndPayment(req.body);
  res.send(result);
});

module.exports = {
  checkCardAndPayment,
};
