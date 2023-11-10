const mongoose = require("mongoose");
const { User } = require("../models");
const logger = require("./logger");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB Connected");
    const user = await User.findOne({ email: "admin@gmail.com" });
    if (!user) {
      await User.create({
        username: "Admin",
        email: "admin@gmail.com",
        password: "123456a",
        role: "manager",
      });
      logger.info("Created admin user");
    } else {
      logger.info("Admin user existed");
    }
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
