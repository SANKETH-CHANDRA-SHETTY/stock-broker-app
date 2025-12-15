const express = require("express");
const authRoutes = express.Router();
const {validateLogin,addSignup}=require("../controllers/authControllers");

authRoutes.post("/login",validateLogin);
authRoutes.post("/signup",addSignup);

module.exports = authRoutes;