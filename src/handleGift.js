const { contract } = require("./contract");
const replyWithCard = require("./replyWithCard");
const metadata = require("./metadata.json");

/*
 * When player tweets "@dexoshi gift @elonmusk", reply with tx hash
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleGift(_twitter, _tweet) {
  try {
    // get twitter handle from author_id
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
    // get description
    const description = metadata[tokenId].description;
    // call "adminSafeTransferFrom"
    const { hash } = await contract["adminSafeTransferFrom"](fromAddress, toAddress, tokenId, 1);
    // reply with tx hash
    const message = `@${fromHandle.data[0].username} gifted \nName: ${description} \nCard ID: #${tokenId} \nTo: @${toHandle} \n${process.env.BLOCK_EXPLORER}/tx/${hash}`;
    // display card
    await replyWithCard(_twitter, _tweet, message, tokenId);
  } catch (err) {
    console.error(err);
    _twitter.v2.reply("Error Code: 900437084321832960", _tweet.data.id);
  }
};
