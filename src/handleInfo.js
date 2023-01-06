const { contract } = require("./contract");
const displayCards = require("./displayCards");

/*
 * When player tweets "@dexoshi info @elonmusk", reply with players info
 * https://user-images.githubusercontent.com/19412160/210154006-53c35d08-50b3-40d1-9858-95dc54fa29f5.png
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleInfo(_twitter, _tweet) {
  try {
    // get twitter handle
    const handle = _tweet.data.text.split(" ")[2].split("@")[1];
    // get twitter user Id
    const user = await _twitter.v2.usersByUsernames([handle]);
    // call "twitterIdToAddress" to get address on chain
    const address = await contract["twitterIdToAddress"](user.data[0].id);
    // reply with overview
    await _twitter.v2.reply(`User: ${handle} \nAddress: ${address}`, _tweet.data.id);
    // reply with cards
    await displayCards(_twitter, _tweet, address);
  } catch (err) {
    console.error("handleInfo error:", err);
    _twitter.v2.reply("Error Code: 1101264495337365504", _tweet.data.id);
  }
};
