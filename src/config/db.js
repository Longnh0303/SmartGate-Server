const mongoose = require("mongoose");
const { User } = require("../models");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected !");
    const user = await User.findOne({ email: "admin@gmail.com" });
    if (!user) {
      await User.create({
        username: "Admin",
        email: "admin@gmail.com",
        password: "123456a",
        role: "manager",
      });
      console.log("Created admin user");
    } else {
      console.log("Admin user existed");
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
