const socketIO = require("socket.io");
const logger = require("../config/logger");

let io;

const initSocketHandler = (httpServer) => {
  try {
    io = socketIO(httpServer);
    logger.info("Socket.io initialized!");

    io.on("connection", (socket) => {
      // Tạo ra room để gửi dữ liệu real-time
      socket.join("realtime-room");
      // Gửi tin nhắn chào mừng
      socket.emit("welcome", "Welcome to the admin room!");
    });

    io.on("error", (error) => {
      logger.error(`Socket.io error: ${error.message}`);
    });

    return io;
  } catch (error) {
    logger.error(`Failed to initialize Socket.io: ${error.message}`);
    throw error;
  }
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  initSocketHandler,
  getIO,
};
