const { contract } = require("./contract.js");

/*
 * When player tweets "@dexoshi transfer 0xAlice 1 1", reply with tx hash
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleTransfer(_twitter, _tweet) {
  try {
    // get twitter handle from author_id
    const fromHandle = await _twitter.v2.users([_tweet.data.author_id]);
    // call "twitterIdToAddress" to get address on chain
    const fromAddress = await contract["twitterIdToAddress"](_tweet.data.author_id);
    // get to Address
    const toAddress = _tweet.data.text.split(" ")[2];
    // get tokenId
    const tokenId = _tweet.data.text.split(" ")[3];
    // get amount
    const amount = _tweet.data.text.split(" ")[4];
    // call "adminSafeTransferFrom"
    const receipt = await contract["adminSafeTransferFrom"](fromAddress, toAddress, tokenId, amount);
    // reply with tx hash
    const message = `@${fromHandle.data[0].username} transfered ID: ${tokenId} to ${toAddress}. ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
    await _twitter.v2.reply(message, _tweet.data.id);
  } catch (err) {
    console.error(err);
    _twitter.v2.reply("Error Code: 3278906401", _tweet.data.id);
  }
};
