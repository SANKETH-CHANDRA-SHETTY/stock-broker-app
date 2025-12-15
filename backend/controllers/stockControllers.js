const db = require("../db");
const logger = require("../logger");

const userCurrentStocks = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const [isUser] = await db.query("SELECT 1 FROM Users WHERE id=?", [
      user_id,
    ]);
    if (isUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const [result] = await db.query(
      "SELECT sus.ticker,s.price FROM Stock_User_Subscriptions sus JOIN Stocks s ON sus.ticker=s.ticker WHERE user_id=?",
      [user_id]
    );
    
    res.status(200).json(result);
  } catch (err) {
    logger.error("internal server error", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "internal server error" });
  }
};

const userAddStocks = async (req, res) => {
  const { user_id, ticker } = req.body;
  try {
    const [isUser] = await db.query("SELECT 1 FROM Users WHERE id=?", [
      user_id,
    ]);
    if (isUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const [isStock] = await db.query("SELECT 1 FROM Stocks WHERE ticker=?", [
      ticker,
    ]);
    if (isStock.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    const [isUserStock] = await db.query(
      "SELECT * FROM Stock_User_Subscriptions WHERE user_id=? AND ticker=?",
      [user_id, ticker]
    );
    if (isUserStock.length !== 0) {
      return res
        .status(400)
        .json({ error: "User already subscribed to stock" });
    }
    const [result] = await db.query(
      "Insert INTO Stock_User_Subscriptions (user_id,ticker,subscribed_at) VALUES(?,?,?)",
      [user_id, ticker, new Date()]
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("internal server error", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "internal server error" });
  }
};

const userRemoveStocks = async (req, res) => {
  const { user_id, ticker } = req.body;
  try {
    const [isUser] = await db.query("SELECT 1 FROM Users WHERE id=?", [
      user_id,
    ]);
    if (isUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const [isStock] = await db.query("SELECT 1 FROM Stocks WHERE ticker=?", [
      ticker,
    ]);
    if (isStock.length === 0) {
      return res.status(404).json({ error: "Stock not found" });
    }
    const [isUserStock] = await db.query(
      "SELECT * FROM Stock_User_Subscriptions WHERE user_id=? AND ticker=?",
      [user_id, ticker]
    );
    if (isUserStock.length === 0) {
      return res.status(404).json({ error: "User is not subscribed to stock" });
    }
    const [result] = await db.query(
      "DELETE FROM Stock_User_Subscriptions WHERE user_id=? AND ticker=?",
      [user_id, ticker]
    );
    res.status(200).json(result);
  } catch (err) {
    logger.error("internal server error", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "internal server error" });
  }
};

const getAllStocks = async (req, res) => {
  try {
    const [stocks] = await db.query("SELECT ticker, price FROM Stocks");
    res.status(200).json(stocks);
  } catch (err) {
    logger.error("internal server error", {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { userCurrentStocks, userAddStocks, userRemoveStocks,getAllStocks };
