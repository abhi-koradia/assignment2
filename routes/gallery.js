const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { getAllFiles } = require("../utils/fileUtils");

router.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "gallery.html"));
});

router.get("/gallery-pagination", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "gallery-pagination.html"));
});

router.get("/random-gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "random-gallery.html"));
});

router.get("/fetch-all/pages/:index", (req, res) => {
  const ITEMS_PER_PAGE = parseInt(req.query.items_per_page, 10) || 3;
  const pageIndex = parseInt(req.params.index, 10);

  if (isNaN(pageIndex) || pageIndex < 1) {
    return res.status(400).send("Invalid page index.");
  }

  const allFiles = getAllFiles();
  const totalItems = allFiles.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (pageIndex > totalPages) {
    return res.status(404).send("Page not found.");
  }

  const startIndex = (pageIndex - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageItems = allFiles.slice(startIndex, endIndex);

  const response = {
    page: pageIndex,
    totalPages: totalPages,
    files: pageItems,
  };

  res.json(response);
});

router.get("/fetch-single", (req, res) => {
  const uploadDir = path.join(__dirname, "../upload");
  const uploads = fs.readdirSync(uploadDir);

  // Log the list of all images
  console.log("All images:", uploads);

  // Add error handling
  if (uploads.length === 0) {
    return res.status(503).send({ message: "No images" });
  }

  const randomIndex = Math.floor(Math.random() * uploads.length);
  const randomImage = uploads[randomIndex];

  // Log the randomly selected image
  console.log("Randomly selected image:", randomImage);

  res.sendFile(path.join(uploadDir, randomImage));
});

router.get("/fetch-random-images", (req, res) => {
  
  const numImages = parseInt(req.query.num, 10);
  if (isNaN(numImages) || numImages < 1) {
    return res.status(400).send("Invalid number of images.");
  }

  const allFiles = getAllFiles();
  const numToFetch = Math.min(numImages, allFiles.length);
  const shuffled = allFiles.sort(() => 0.5 - Math.random());
  const selectedFiles = shuffled.slice(0, numToFetch);

  res.json(selectedFiles);
});

router.get("/fetch-all-images", (req, res) => {
  const allFiles = getAllFiles();
  res.json(allFiles);
});

router.get("/total-images", (req, res) => {
  const allFiles = getAllFiles();
  res.json({ total: allFiles.length });
});

module.exports = router;
