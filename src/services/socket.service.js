const socketIO = require("socket.io");
const logger = require("../config/logger");
const corsOptions = require("../config/cors");

let io;

const initSocketHandler = (httpServer) => {
  try {
    io = socketIO(httpServer, {
      cors: corsOptions,
      allowEIO3: true,
    });
    logger.info("Socket.io initialized");

    io.on("connection", (socket) => {
      // Tạo ra room để gửi dữ liệu real-time
      socket.join("realtime-room");
      // Gửi tin nhắn chào mừng
      socket.emit("welcome", "Welcome to the admin room");
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
    throw new Error("Socket.io not initialized");
  }
  return io;
};

const sendMessageToRoom = (roomName, message) => {
  try {
    io.to(roomName).emit("mqttMessage", message);
  } catch (error) {
    logger.error(`Error sending message to room ${roomName}: ${error.message}`);
  }
};

module.exports = {
  initSocketHandler,
  getIO,
  sendMessageToRoom,
};
