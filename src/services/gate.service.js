const httpStatus = require("http-status");
const rfidService = require("./rfid.service");
const { History } = require("../models");
const ApiError = require("../utils/ApiError");

const checkCardAndPayment = async (body) => {
  const { cardId } = body;
  const rfid = await rfidService.getRfidByCardId(cardId);
  if (!rfid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Thẻ không tồn tại trong hệ thống"
      );
    }
    
  const history = await History.findOne({ cardId, done: false });

  // Nếu chưa có lịch sử tức là xe đang vào trường => Cần tạo 1 lịch sử
  if (!history) {
    const history = await History.create({
      cardId,
      time_check_in: Date.now(),
      old_balance: rfid.balance,
    });
    return history;
  } else {
    // Nếu có rồi tức là xe đang đi ra khỏi trường => Cần tính tiền
    const cost = 3000; // VND
    if (rfid.role ==='student' && rfid.balance < cost) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Số dư không đủ để thanh toán"
      );
    }

    // Tính toán tiền và lưu lại ở thông tin thẻ và ở lịch sử
    if(rfid.role ==='student' && rfid.balance >= cost){
      const newBalance = rfid.balance - cost;
      rfid.balance = newBalance;
      history.new_balance = newBalance;
    }
 
    // Cập nhật thời gian check out và trạng thái hoàn thành
    history.time_check_out = Date.now();
    history.done = true;

    // Lưu lại thông tin thẻ và lịch sử
    await rfid.save();
    await history.save();

    return history;
  }
};

module.exports = {
  checkCardAndPayment,
};
