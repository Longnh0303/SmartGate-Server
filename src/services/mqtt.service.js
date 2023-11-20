const mqtt = require("mqtt");
const logger = require("../config/logger");
const { sendMessageToRoom } = require("./socket.service");
const { findDeviceByMac, createDevice } = require("../services/device.service");

const initMQTTHandler = () => {
  const mqttBroker = "103.82.22.78";
  const mqttTopic = "status";
  const mqttUsername = "longnh";
  const mqttPassword = "1";

  const client = mqtt.connect({
    host: mqttBroker,
    port: 1883,
    username: mqttUsername,
    password: mqttPassword,
  });

  client.on("connect", () => {
    logger.info("Connected to MQTT broker");
    client.subscribe(mqttTopic, (err) => {
      if (!err) {
        logger.info(`Subscribed to topic ${mqttTopic}`);
      } else {
        logger.error(`Error subscribing to topic ${mqttTopic}: ${err}`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    // Chuyển đổi chuỗi JSON thành đối tượng JavaScript
    const messageObject = JSON.parse(message.toString());

    // Lấy giá trị của mac từ đối tượng messageObject
    const mac = messageObject.mac;
    // Kiểm tra xem thiết bị đã tồn tại hay chưa
    const existingDevice = await findDeviceByMac(mac);
    if (existingDevice) {
      // Thiết bị đã tồn tại
      // Gửi tin nhắn MQTT vào phòng Socket.io
      const dataMsg = {
        type: "gate",
        data: { topic, message: message.toString() },
      };
      const room = `${existingDevice.mac}_status`;
      // TODO:
      sendMessageToRoom(room, dataMsg);
    } else {
      // Thiết bị chưa tồn tại, tạo mới
      await createDevice({ mac: mac });
      logger.info(`Created new device with MAC ${mac}`);
    }
  });
  client.on("close", () => {
    logger.info("Disconnected from MQTT broker");
  });

  client.on("error", (err) => {
    logger.error(`MQTT error: ${err}`);
  });
};

module.exports = {
  initMQTTHandler,
};
