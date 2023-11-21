const httpStatus = require("http-status");
const rfidService = require("./rfid.service");
const { History } = require("../models");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");
const { sendMessageToRoom } = require("./socket.service");

const emitDeviceStatus = (macAddress, type, message) => {
  const dataMsg = { type, data: { message } };
  sendMessageToRoom(`${macAddress}_status`, "gate_status", dataMsg);
};

const checkCardAndPayment = async (body) => {
  const { cardId, macAddress } = body;
  const rfid = await rfidService.getRfidByCardId(cardId);

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
  } else {
    await updateHistoryEntry(cardId, history, rfid, macAddress);
  }

  return history;
};

const createNewHistoryEntry = async (cardId, rfid, macAddress) => {
  emitDeviceStatus(macAddress, "error", "Thẻ đã vào");
  const dataMsg = {
    type: "access",
    data: { cardId: cardId, time: Date.now() },
  };
  sendMessageToRoom(`${macAddress}_status`, "access_status", dataMsg);
  return await History.create({
    cardId,
    time_check_in: Date.now(),
    old_balance: rfid.balance,
    name: rfid.name,
    role: rfid.role,
    gateIn: macAddress,
  });
};

const updateHistoryEntry = async (cardId, history, rfid, macAddress) => {
  emitDeviceStatus(macAddress, "error", "Thẻ đã ra");
  const dataMsg = {
    type: "exit",
    data: { cardId: cardId, time: Date.now() },
  };
  sendMessageToRoom(`${macAddress}_status`, "exit_status", dataMsg);
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
