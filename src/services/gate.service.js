const httpStatus = require("http-status");
const rfidService = require("./rfid.service");
const { History } = require("../models");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { sendMessageToRoom } = require("./socket.service");

const checkCardAndPayment = async (body) => {
  const { cardId, macAddress } = body;
  const rfid = await rfidService.getRfidByCardId(cardId);
  const emitDeviceStatus = (macAddress, type, message) => {
    const dataMsg = { type, data: { message } };
    sendMessageToRoom(`${macAddress}_status`, dataMsg);
  };

  if (!rfid) {
    emitDeviceStatus(macAddress, "error", "Thẻ không tồn tại trong hệ thống");
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Thẻ không tồn tại trong hệ thống"
    );
  }

  let history = await History.findOne({ cardId, done: false });
  const isNewEntry = !history;
  if (isNewEntry) {
    history = await createNewHistoryEntry(cardId, rfid, macAddress);
    emitDeviceStatus(macAddress, "access", {
      cardId: cardId,
      time: Date.now(),
    });
  } else {
    await updateHistoryEntry(history, rfid, macAddress);
    emitDeviceStatus(macAddress, "exit", {
      cardId: cardId,
      time: Date.now(),
    });
  }

  return history;
};

const createNewHistoryEntry = async (cardId, rfid, macAddress) => {
  return await History.create({
    cardId,
    time_check_in: Date.now(),
    old_balance: rfid.balance,
    name: rfid.name,
    role: rfid.role,
    gateIn: macAddress,
  });
};

const updateHistoryEntry = async (history, rfid, macAddress) => {
  const cost = 3000; // VND
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const daysCheckedIn = Math.ceil(
    (Date.now() - history.time_check_in) / millisecondsInADay
  );
  const fee = cost * daysCheckedIn;

  if (rfid.role === "student" && rfid.balance < fee) {
    emitDeviceStatus(macAddress, "error", "Số dư không đủ để thanh toán");
    throw new ApiError(httpStatus.BAD_REQUEST, "Số dư không đủ để thanh toán");
  }

  if (rfid.role === "student" && rfid.balance >= fee) {
    rfid.balance -= fee;
    history.new_balance = rfid.balance;
    history.fee = fee;
  } else if (rfid.role === "guest") {
    history.fee = cost;
    history.new_balance = rfid.balance;
  }

  history.time_check_out = Date.now();
  history.done = true;
  history.gateOut = macAddress;

  await rfid.save();
  await history.save();
};

module.exports = {
  checkCardAndPayment,
};
