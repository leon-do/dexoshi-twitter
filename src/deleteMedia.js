const fs = require("fs");

module.exports = async function deleteFile(_path) {
  if (_path.includes("_default.jpg")) return true;
  fs.unlink(_path, (err) => {
    if (err) return false;
    return true;
  });
};
