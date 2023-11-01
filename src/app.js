const express = require("express");
const connectDB = require("./config/db");
const routes = require("./routes");
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
const handleErrors = require("./middlewares/handleErrors");
require("express-async-errors");
const PORT = process.env.PORT;
// CORS middleware
const cors = require("cors");
const corsOptions = require("./config/cors");
const app = express();

// Connect Database
connectDB();

// Middleware for parsing request bodies
app.use(express.json());

// allow all Cross Site Resource Sharing (CORS)
app.use(cors(corsOptions));

// Routes
app.use("/api", routes);
// Handle errors
app.use(handleErrors);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
