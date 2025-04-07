const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1); // trust first proxy

// Set up Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
})

app.use(limiter);
// app.use(cors()); // for development purposes

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || /ez-finance-shrey\.netlify\.app$/.test(origin)) {
      // Allow requests from `ez-finance-shrey.netlify.app` and any of its subdomains
      callback(null, true);
    } else {
      // Reject all other origins
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH", // allowed methods
  allowedHeaders: "Content-Type,Authorization", // allowed headers
};

// Apply CORS with the dynamic configuration
app.use(cors(corsOptions));

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
