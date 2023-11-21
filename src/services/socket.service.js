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
      // Listener cho sự kiện client yêu cầu được join room
      socket.on("request-join-room", (roomName) => {
        joinRoom(socket, roomName);
      });

      // Listener cho sự kiện client yêu cầu thoát khỏi room
      socket.on("request-leave-room", (roomName) => {
        leaveRoom(socket, roomName);
      });
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

// const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// };

const sendMessageToRoom = (roomName, message) => {
  try {
    io.to(roomName).emit("device_status", message);
  } catch (error) {
    logger.error(`Error sending message to room ${roomName}: ${error.message}`);
  }
};

// Hàm để tham gia vào room với roomName
const joinRoom = (socket, roomName) => {
  socket.join(roomName);
};

// Hàm để rời khỏi room với roomName
const leaveRoom = (socket, roomName) => {
  socket.leave(roomName);
};

module.exports = {
  initSocketHandler,
  sendMessageToRoom,
  joinRoom,
  leaveRoom,
};
