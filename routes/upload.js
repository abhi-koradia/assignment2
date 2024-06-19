// routes/upload.js
const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("../middleware/multer");

router
  .route("/upload")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../views", "upload.html"));
  })
  .post(upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
  });

router
  .route("/upload-multiple")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../views", "upload-multiple.html"));
  })
  .post(upload.array("files", 15), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }
    const filePaths = req.files.map((file) => file.path);
    res.status(200).send(`Files uploaded successfully: ${filePaths.join(", ")}`);
  });

module.exports = router;
