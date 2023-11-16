const httpStatus = require("http-status");
const rfidService = require("./rfid.service");
const { History } = require("../models");
const ApiError = require("../utils/ApiError");
const { getIO } = require("./socket.service");

const checkCardAndPayment = async (body) => {
  const io = getIO();

  const { cardId, macAddress } = body;
  const rfid = await rfidService.getRfidByCardId(cardId);
  if (!rfid) {
    const dataMsg = {
      type: "error",
      data: { message: "Thẻ không tồn tại trong hệ thống" },
    };
    io.to(`${macAddress}_status`).emit("device_status", dataMsg);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Thẻ không tồn tại trong hệ thống"
    );
  }

  const history = await History.findOne({ cardId, done: false });

  const dataMsg = {
    type: "access",
    data: { cardId: cardId },
  };

  // Nếu chưa có lịch sử tức là xe đang vào trường => Cần tạo 1 lịch sử
  if (!history) {
    const history = await History.create({
      cardId,
      time_check_in: Date.now(),
      old_balance: rfid.balance,
      name: rfid.name,
      role: rfid.role,
      gateIn: macAddress,
    });
    io.to(`${macAddress}_status`).emit("device_status", dataMsg);
    return history;
  } else {
    // Nếu có rồi tức là xe đang đi ra khỏi trường => Cần tính tiền
    const cost = 3000; // VND
    if (rfid.role === "student" && rfid.balance < cost) {
      const dataMsg = {
        type: "error",
        data: { message: "Số dư không đủ để thanh toán" },
      };
      io.to(`${macAddress}_status`).emit("device_status", dataMsg);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Số dư không đủ để thanh toán"
      );
    }

    // Tính toán tiền và lưu lại ở thông tin thẻ và ở lịch sử
    if (rfid.role === "student" && rfid.balance >= cost) {
      const newBalance = rfid.balance - cost;
      rfid.balance = newBalance;
      history.new_balance = newBalance;
      io.to(`${macAddress}_status`).emit("device_status", dataMsg);
    } else {
      io.to(`${macAddress}_status`).emit("device_status", dataMsg);
      history.new_balance = rfid.balance;
    }

    // Cập nhật thời gian check out và trạng thái hoàn thành
    history.time_check_out = Date.now();
    history.done = true;
    history.gateOut = macAddress;
    // Lưu lại thông tin thẻ và lịch sử
    await rfid.save();
    await history.save();

    return history;
  }
};

module.exports = {
  checkCardAndPayment,
};
