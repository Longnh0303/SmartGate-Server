const allowOrigins = "*";

const corsOptions = {
  origin: [...allowOrigins],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

module.exports = corsOptions;
