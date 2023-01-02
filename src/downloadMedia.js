const fs = require("fs");
const axios = require("axios");

/*
 * @param {string} _url - https://i.imgur.com/Xs2XCZd.jpeg
 * download media and store in media folder
 * @returns {Promise<path of file>}
 * */
module.exports = async function getFile(_url) {
  try {
    // random name
    const name = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    // get extension from url
    const extension = _url.split(".").pop();
    // path to save file
    const path = `./media/${name}.${extension}`;
    // get file
    const response = await axios.get(_url, { responseType: "arraybuffer" });
    // write file
    fs.writeFileSync(path, response.data);
    // return path
    return path;
  } catch (error) {
    return "./media/_default.jpg";
  }
};
