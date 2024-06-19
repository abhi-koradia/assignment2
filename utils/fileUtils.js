// utils/fileUtils.js
const fs = require("fs");
const path = require("path");

const getAllFiles = () => {
  const directoryPath = path.join(__dirname, "../upload");
  const files = fs.readdirSync(directoryPath);
  return files.map((file) => ({
    name: file,
    content: fs.readFileSync(path.join(directoryPath, file), "base64"),
  }));
};

module.exports = { getAllFiles };
