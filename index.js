/*
Name: Abhi H. Koradia
Number: n01597629

<---All Path--->
upload - upload single file
upload-multiple - upload multiple file
fetch-single - fetch random single image
fetch-multiple - fetch image as user needed
gallery - fetch all image
gallery-pagination - fetch all with pagination
*/

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");

// Middleware:
app.use(express.urlencoded({ extended: true })); // Handle normal forms -> url encoded
app.use(express.json()); // Handle raw JSON data

// Check and create upload directory
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, "views")));

// Routes
const homeRoutes = require("./routes/home");
const uploadRoutes = require("./routes/upload");
const galleryRoutes = require("./routes/gallery");

app.use("/", homeRoutes);
app.use("/", uploadRoutes);
app.use("/", galleryRoutes);

// Catch all other requests
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
