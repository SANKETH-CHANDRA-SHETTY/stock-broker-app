const db = require("../db");
const logger = require("../logger");

const UPDATE_INTERVAL_MS = 1000; 

function generatePriceChange(currentPrice) {
  const percentageChange = (Math.random() * 2 - 1) * 0.01;
  const change = currentPrice * percentageChange;
  return Math.max(0, currentPrice + change); 
}

async function updateStockPrices() {
  try {
    const [stocks] = await db.query(
      "SELECT ticker, price FROM Stocks"
    );

    for (const stock of stocks) {
      const newPrice = generatePriceChange(stock.price);

      await db.query(
        "UPDATE Stocks SET price = ? WHERE ticker = ?",
        [newPrice, stock.ticker]
      );

    }
  } catch (err) {
    logger.error("Stock price update failed", {
      message: err.message,
      stack: err.stack
    });
  }
}

function startStockPriceUpdater() {
  logger.info("Starting stock price updater service");

  setInterval(() => {
    updateStockPrices();
  }, UPDATE_INTERVAL_MS);
}

module.exports = {
  startStockPriceUpdater
};