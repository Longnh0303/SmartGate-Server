const Rfid = require("../models/rfid.model");
const httpStatus = require("http-status");


// Create a new Rfid
const createRfid = async (req, res) => {
  try {
    const {
      cardId,
      name,
      usercode,
      role,
      department,
      carInfo,
      carColor,
      licensePlates,
    } = req.body;

    // Kiểm tra xem "cardId" đã tồn tại trong hệ thống chưa
    const existingRfidCard = await Rfid.findOne({ cardId });

    if (existingRfidCard) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Thẻ đã tồn tại trong hệ thống",
      });
    }

    // Tạo một đối tượng "Rfid" với các trường từ yêu cầu
    const newRfid = new Rfid({
      cardId,
      name,
      usercode,
      role,
      department,
      carInfo,
      carColor,
      licensePlates,
    });

    // Lưu đối tượng "Rfid" vào cơ sở dữ liệu
    const createdRfid = await newRfid.save();

    return res.status(httpStatus.CREATED).json({
      newRfid: createdRfid,
    });
  } catch (error) {
    console.error("Yêu cầu thất bại:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Yêu cầu thất bại" });
  }
};

  const getRfids = async (req, res, next) => {
    try {
      const { searchTerm } = req.query;
  
      // Kiểm tra xem searchTerm có được cung cấp hay không
      if (!searchTerm) {
        const Rfids = await Rfid.find();
        return res.status(httpStatus.OK).json(Rfids);
      } else {
        // Sử dụng RegExp để tạo mẫu tìm kiếm không phân biệt hoa thường
        const searchPattern = new RegExp(searchTerm, "i");
  
        // Tìm các RFID có trường "name" trong "userInfo" chứa chuỗi tìm kiếm
        const Rfids = await Rfid.find({
          "name": searchPattern,
        });
  
        return res.status(httpStatus.OK).json(Rfids);
      }
    } catch (error) {
      console.error("Yêu cầu thất bại:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Yêu cầu thất bại",
      });
    }
  };
  
// Get RFID by Card ID
const getCardById = async (req, res) => {
  try {
    const { cardId } = req.params;

    const rfid = await Rfid.findOne({ cardId });

    if (!rfid) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Không tìm thấy thẻ trong hệ thống" });
    }

    res.json(rfid);
  } catch (error) {
    console.error("Yêu cầu thất bại:", error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Yêu cầu thất bại" });
  }
};

// Update RFID by ID
const updateRfid = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body; // Dữ liệu mới cần cập nhật

    // Tìm "Rfid" cần cập nhật theo id
    const rfid = await Rfid.findById(id);

    if (!rfid) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: 'Không tìm thấy thẻ trong hệ thống' });
    }

        // Kiểm tra xem có gửi lên cardId
        if (updatedData.cardId) {
          // Kiểm tra xem cardId đã tồn tại trong hệ thống chưa
          const existingRfid = await Rfid.findOne({ cardId: updatedData.cardId });
    
          if (existingRfid && existingRfid._id.toString() !== id) {
            return res
              .status(httpStatus.BAD_REQUEST)
              .json({ message: 'Thẻ đã tồn tại trong hệ thống' });
          }
        }
    // Cập nhật thông tin "Rfid" với dữ liệu mới
    for (const key in updatedData) {
      if (Object.prototype.hasOwnProperty.call(updatedData, key)) {
        rfid[key] = updatedData[key];
      }
    }

    // Lưu thông tin "Rfid" đã cập nhật vào cơ sở dữ liệu
    await rfid.save();

    return res.status(httpStatus.OK).json(rfid);
  } catch (error) {
    console.error('Yêu cầu thất bại:', error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Yêu cầu thất bại' });
  }
};

// Delete rfid by ID
const deleteRfid = async (req, res) => {
  const { id } = req.params;
  try {
    // Now delete rfid
    const rfid = await Rfid.findByIdAndDelete(id);

    if (!rfid) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Thẻ không tồn tại" });
    }

    res.json({ message: "Xóa thẻ thành công" });
  } catch (error) {
    console.error("Yêu cầu thất bại:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Kết nối đến máy chủ thất bại" });
  }
};

  module.exports = {
    createRfid,
    getRfids,
    getCardById,
    updateRfid,
    deleteRfid
  };