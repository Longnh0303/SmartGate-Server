const httpStatus = require("http-status");

module.exports = function handleErrors(err, req, res, next) {
  console.error(err.stack); // log lỗi vào console
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message }); // gửi lỗi về cho client
};
