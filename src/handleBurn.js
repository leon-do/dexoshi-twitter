const { contract } = require("./contract.js");

/*
 * When player tweets "@dexoshi burn 1", burn token & reply with tx hash
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleBurn(_twitter, _tweet) {
  try {
    const fromHandle = await _twitter.v2.users([_tweet.data.author_id]);
    // call "twitterIdToAddress" to get address on chain
    const fromAddress = await contract["twitterIdToAddress"](_tweet.data.author_id);

    // get token id to burn
    const tokenId = _tweet.data.text.split(" ")[2];

    // call "adminSafeTransferFrom"
    const receipt = await contract["adminBurn"](fromAddress, tokenId, 1);

    // reply with tx hash
    const message = `@${fromHandle.data[0].username} burnt ID: ${tokenId}. ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
    await _twitter.v2.reply(message, _tweet.data.id);
  } catch (err) {
    console.error(err);
    _twitter.v2.reply("Error Code: 1101264495337365504", _tweet.data.id);
  }
};
