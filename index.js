/*
Name: Abhi H. Koradia
Number: n01597629
*/

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Middleware:
app.use(express.urlencoded({ extended: true })); // Handle normal forms -> url encoded
app.use(express.json()); // Handle raw JSON data

// Check and create upload directory
const uploadDir = path.join(__dirname, 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, "views")));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Assignment 2');
});

// Home route
app.get('/home', (req, res) => {
  res.send('Welcome to Assignment 2');
});

// Single file upload route
app
  .route("/upload")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "views", "upload.html"));
  })
  .post(upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
  });

// Multiple file upload route
app
  .route("/upload-multiple")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "views", "upload-multiple.html"));
  })
  .post(upload.array("files", 15), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }
    const filePaths = req.files.map((file) => file.path);
    res.status(200).send(`Files uploaded successfully: ${filePaths.join(", ")}`);
  });

// Fetch single random file route
app.get("/fetch-single", (req, res) => {
  let uploadDir = path.join(__dirname, "upload");
  let uploads = fs.readdirSync(uploadDir);

  // Log the list of all images
  console.log("All images:", uploads);

  // Add error handling
  if (uploads.length === 0) {
    return res.status(503).send({
      message: "No images",
    });
  }

  let max = uploads.length - 1;
  let min = 0;
  let index = Math.round(Math.random() * (max - min) + min);
  let randomImage = uploads[index];

  // Log the randomly selected image
  console.log("Randomly selected image:", randomImage);

  // Log the image being fetched
  console.log("Fetching image:", randomImage);

  res.sendFile(path.join(uploadDir, randomImage));
});

// Fetch all images route
app.get("/fetch-all-images", (req, res) => {
  const directoryPath = path.join(__dirname, "upload");
  const files = fs.readdirSync(directoryPath);
  const fileContents = files.map((file) => {
    return {
      name: file,
      content: fs.readFileSync(path.join(directoryPath, file), "base64")
    };
  });

  res.json(fileContents);
});

// Serve gallery.html
app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery.html"));
});

// Catch all other requests
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
