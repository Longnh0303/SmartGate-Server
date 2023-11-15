const allowOrigins = ["http://localhost:3000"];
const corsOptions = {
  origin: [...allowOrigins],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};
module.exports = corsOptions;
