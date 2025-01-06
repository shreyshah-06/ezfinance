const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");

const PORT = process.env.PORT || 5001;
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
