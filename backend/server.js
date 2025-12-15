const express = require("express");
const logger = require("./logger");
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/userstock", require("./routes/stockRoutes"));

const { startStockPriceUpdater } = require("./services/stockPriceUpdater");
startStockPriceUpdater();

app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ SERVER IS ALIVE on port ${PORT}`);
});