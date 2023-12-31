const httpStatus = require("http-status");

module.exports = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "Bạn không có quyền thực hiện thao tác" });
    }
    next();
  };
};
