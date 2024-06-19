// routes/home.js
const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.send('Welcome to Assignment 2');
});

module.exports = router;
