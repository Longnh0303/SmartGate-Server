const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { Rfid } = require("../models");

const createRfid = async (rfidBody) => {
  if (await Rfid.isCardIdExisted(rfidBody.cardId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Đã tồn tại thẻ trong hệ thống!"
    );
  }
  return Rfid.create(rfidBody);
};

const getRfids = async () => {
  const result = await Rfid.find();
  return result;
};

const getRfidById = async (id) => {
  return Rfid.findById(id);
};

const getRfidByCardId = async (cardId) => {
  return Rfid.findOne({ cardId });
};

const updateRfidById = async (id, updateBody) => {
  const rfid = await getRfidById(id);
  if (!rfid) throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thẻ");

  // Kiểm tra nếu ther đã tồn tại
  if (updateBody.cardId) {
    if (await Rfid.isCardIdExisted(updateBody.cardId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Thẻ đã tồn tại");
    }

    rfid.cardId = updateBody.cardId;
  }

  Object.assign(rfid, updateBody);

  await rfid.save();
  return rfid;
};

const deleteRfidById = async (id) => {
  const rfid = await getRfidById(id);
  if (!rfid) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy thẻ");
  }
  await rfid.deleteOne();
  return rfid;
};

module.exports = {
  createRfid,
  getRfids,
  getRfidById,
  getRfidByCardId,
  updateRfidById,
  deleteRfidById,
};
