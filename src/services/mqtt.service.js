const mqtt = require("mqtt");
const logger = require("../config/logger");
const { sendMessageToRoom } = require("./socket.service");

const initMQTTHandler = () => {
  const mqttBroker = "172.20.10.3";
  const mqttTopic = "test";
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

  client.on("message", (topic, message) => {
    // Gửi tin nhắn MQTT vào phòng Socket.io
    const dataMsg = {
      type: "gate",
      data: { topic, message: message.toString() },
    };
    sendMessageToRoom("realtime-room", dataMsg);
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
