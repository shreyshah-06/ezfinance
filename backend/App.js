const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 5000;

// Set up Rate Limiting
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
})

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/index"));

const serverStart = async () => {
  try {
    await db.authenticate();
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
serverStart();
