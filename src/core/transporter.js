const mqtt = require('mqtt');
const logger = require('@config/logger');

class MqttTransporter {
  constructor(url, options) {
    this.brokerUrl = url;
    this.options = options;
    this.client = null;
  }

  connect() {
    this.client = mqtt.connect(this.brokerUrl, this.options);

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        logger.info('Connected to MQTT Broker');

        resolve();
      });

      this.client.on('error', (err) => {
        logger.error('Failed to connect to MQTT Broker', err);

        reject(err);
      });

      this.client.on('reconnect', () => {
        logger.info('Reconnecting to MQTT Broker...');
      });
    });
  }

  /**
   * On message events
   * @param {Function} cb - callback function
   */
  onMessage(cb) {
    this.client.on('message', cb);
  }

  /**
   * subscribe to topic
   * @param {string} topic - topic name
   */
  sub(topic) {
    this.client.subscribe(topic, (err) => {
      if (err) {
        logger.error('Faild to subscribe to MQTT topic', topic, err);
      }
    });
  }

  pub(topic, message, cb) {
    if (this.client.connected) {
      this.client.publish(topic, JSON.stringify(message), (err) => {
        if (err) {
          cb(new Error(`Publish message for topic ${topic} got error: ${err}`), null);
        }

        cb(null, true);
      });
    } else {
      cb(new Error('Mqtt client is not connected'), null);
    }
  }

  disconnect() {
    this.client.end(true);
    logger.info('Disconnected from MQTT Broker');
  }
}

module.exports = MqttTransporter;
