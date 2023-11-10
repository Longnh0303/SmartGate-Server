const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { userService } = require('./services'); 

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('MongoDB Connected !');
  server = app.listen(config.port, async () => {
    logger.info(`Server started on port ${config.port}`);
    await userService.createAdmin();
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});