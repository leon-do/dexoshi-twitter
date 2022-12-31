const { contract } = require("./contract.js");

/*
 * When player tweets "@dexoshi transfer @elonmusk 1", reply with tx hash
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleTransfer(_twitter, _tweet) {
  try {
    const fromHandle = await _twitter.v2.users([_tweet.data.author_id]);
    // call "twitterIdToAddress" to get address on chain
    const fromAddress = await contract["twitterIdToAddress"](_tweet.data.author_id);

    // get twitter handle
    const toHandle = _tweet.data.text.split(" ")[2].split("@")[1];
    // get twitter user Id
    const toUser = await _twitter.v2.usersByUsernames([toHandle]);
    // call "twitterIdToAddress" to get address on chain
    const toAddress = await contract["twitterIdToAddress"](toUser.data[0].id.toString());

    // get tokenId
    const tokenId = _tweet.data.text.split(" ")[3];

    // call "adminSafeTransferFrom"
    const receipt = await contract["adminSafeTransferFrom"](fromAddress, toAddress, tokenId, 1);

    // reply with tx hash
    const message = `@${fromHandle.data[0].username} transfered ID: ${tokenId} to @${toHandle}. ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
    await _twitter.v2.reply(message, _tweet.data.id);
  } catch (err) {
    console.error(err);
    _twitter.v2.reply("Error Code: 20416855", _tweet.data.id);
  }
};
