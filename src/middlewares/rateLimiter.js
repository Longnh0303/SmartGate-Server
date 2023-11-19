const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Trong 15 phút
  max: 20, // Chỉ được gửi tối đa 20 lần
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
