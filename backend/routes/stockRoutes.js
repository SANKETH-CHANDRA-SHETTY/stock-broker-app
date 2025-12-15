const express = require("express");
const stockRoutes = express.Router();
const {userCurrentStocks, userAddStocks, userRemoveStocks, getAllStocks} = require("../controllers/stockControllers")

stockRoutes.get("/all", getAllStocks);
stockRoutes.get("/:user_id",userCurrentStocks);
stockRoutes.post("/",userAddStocks);
stockRoutes.delete("/",userRemoveStocks)


module.exports = stockRoutes;