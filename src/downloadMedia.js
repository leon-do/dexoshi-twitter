const fs = require("fs");
const axios = require("axios");

/*
 * @param {string} _url - https://i.imgur.com/Xs2XCZd.jpeg
 * download media from url
 * @returns {Promise<path>}
 * */
module.exports = async function getFile(_url) {
  const name = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // random name
  const extension = _url.split(".").pop(); // get extension from url
  const path = `./media/${name}.${extension}`; // path to save file
  const response = await axios.get(_url, { responseType: "arraybuffer" }); // get file
  fs.writeFileSync(path, response.data); // write file
  return path; // return path
};
