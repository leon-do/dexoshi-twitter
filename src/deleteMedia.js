const fs = require("fs");

module.exports = async function deleteFile(_path) {
  fs.unlink(_path, (err) => {
    if (err) return false;
    return true;
  });
};
