const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { History } = require("../models");
const { Device } = require("../models");
const getTimeRange = require("../utils/day");

const getAccessStats = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  const query = {};

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  const gateInStats = await History.countDocuments(query);
  const gateOutStats = await History.countDocuments({ done: true, ...query });
  const totalAccess = gateInStats + gateOutStats;

  return { gateInStats, gateOutStats, totalAccess };
};

const getTotalMoney = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  const query = {};

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  try {
    const histories = await History.find(query);
    let totalMoney = 0;

    histories.forEach((history) => {
      if (history.fee) {
        totalMoney += history.fee;
      }
    });
    return { totalMoney };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Lỗi khi lấy tổng số tiền từ dữ liệu"
    );
  }
};

const getAutoMoney = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  const query = {
    role: "student", // Thêm điều kiện tìm kiếm role = student
  };

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  try {
    const histories = await History.find(query);
    let autoMoney = 0;

    histories.forEach((history) => {
      if (history.fee) {
        autoMoney += history.fee; // Tính tổng các trường fee
      }
    });

    return { autoMoney };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Lỗi khi lấy tổng số tiền từ dữ liệu"
    );
  }
};

const getManualMoney = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  const query = {
    role: "guest", // Chỉ tìm kiếm bản ghi có role = guest
  };

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  try {
    const guestHistoriesCount = await History.countDocuments(query); // Đếm số lượng bản ghi có role = guest
    const manualMoney = guestHistoriesCount * 3000; // Nhân số lượng bản ghi với 3000

    return { manualMoney };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Lỗi khi lấy tổng số tiền từ dữ liệu"
    );
  }
};

const getVehicle = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  let query = {};

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  try {
    const history = await History.find(query);

    // Sử dụng Map để lưu trữ thông tin đếm
    const countMap = new Map();

    history.forEach((record) => {
      const { role, cardId } = record;

      // Kiểm tra nếu role là "guest" thì tăng biến totalVehicle
      if (role === "guest") {
        countMap.set("totalVehicle", (countMap.get("totalVehicle") || 0) + 1);
      } else if (!countMap.has(cardId)) {
        // Đếm mỗi cardId một lần duy nhất nếu không phải là 'guest'
        countMap.set(cardId, 1);
      }
    });

    // Chuyển từ Map về định dạng object để trả về kết quả
    const countResult = {};
    for (const [key, value] of countMap) {
      countResult[key] = value;
    }

    let totalCount = 0;
    for (const key in countResult) {
      if (Object.prototype.hasOwnProperty.call(countResult, key)) {
        totalCount += countResult[key];
      }
    }

    return { totalCount };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Lỗi khi lấy số lượng phương tiện từ dữ liệu"
    );
  }
};

const getColumnChartData = async (timeRange) => {
  try {
    const devices = await Device.find({});
    const { fromDate, toDate } = getTimeRange(timeRange);

    const pieChartData = [];

    for (const device of devices) {
      const { mac } = device;

      const query = {
        gateOut: mac,
      };

      const queryGateOut = {
        gateOut: mac,
      };
      const queryGateIn = {
        gateIn: mac,
      };

      if (fromDate && toDate) {
        query.time_check_in = { $gte: fromDate, $lte: toDate };
        queryGateOut.time_check_in = { $gte: fromDate, $lte: toDate };
        queryGateIn.time_check_in = { $gte: fromDate, $lte: toDate };
      }

      const gateOutCount = await History.countDocuments(queryGateOut);
      const gateInCount = await History.countDocuments(queryGateIn);
      const deviceData = await History.find(query);

      const totalRecords = gateOutCount + gateInCount;

      let totalFees = 0;

      // Tính tổng các trường fee
      deviceData.forEach((record) => {
        if (record.fee) {
          totalFees += record.fee;
        }
      });

      const deviceObj = {
        name: mac,
        data: [totalRecords, totalFees],
      };

      pieChartData.push(deviceObj);
    }

    return pieChartData;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Lỗi khi lấy dữ liệu biểu đồ"
    );
  }
};

const getPieChartData = async (timeRange) => {
  let { fromDate, toDate } = getTimeRange(timeRange);

  let query = {};

  if (fromDate && toDate) {
    query.time_check_in = { $gte: fromDate, $lte: toDate };
  }

  try {
    const getRoleCount = async (role) => {
      const gateInCount = await History.countDocuments({
        ...query,
        role,
        gateIn: { $exists: true }, // Lọc các bản ghi có gateIn
      });

      const gateOutCount = await History.countDocuments({
        ...query,
        role,
        gateOut: { $exists: true }, // Lọc các bản ghi có gateOut
      });

      return gateInCount + gateOutCount;
    };

    const guestCount = await getRoleCount("guest");
    const studentCount = await getRoleCount("student");
    const teacherCount = await getRoleCount("teacher");
    const employeeCount = await getRoleCount("employee");

    return [guestCount, studentCount, teacherCount, employeeCount];
  } catch (error) {
    throw new Error("Lỗi khi lấy số lượng bản ghi từ dữ liệu");
  }
};

module.exports = {
  getAccessStats,
  getTotalMoney,
  getAutoMoney,
  getManualMoney,
  getVehicle,
  getColumnChartData,
  getPieChartData,
};
