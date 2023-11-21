const corsOptions = {
  origin: ["http://localhost:3000", "https://longnh-1951060826.tech"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};
module.exports = corsOptions;
