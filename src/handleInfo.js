const { contract } = require("./contract.js");
const getBalancesOf = require("./getBalancesOf.js");
const downloadMedia = require("./downloadMedia");
const deleteMedia = require("./deleteMedia");
const metadata = require("./metadata.json");

/*
 * When player tweets "@dexoshi info @elonmusk", reply with players info
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
    // query the graph
    const balances = await getBalancesOf(address);
    // reply with overview
    await _twitter.v2.reply(`User: ${handle} \nAddress: ${address} \nTotal: ${balances.length}`, _tweet.data.id);
    // reply with balances
    for (let balance of balances) {
      const balanceMessage = `ID: ${balance.tokenId} \nAmount: ${balance.amount}`;
      const imageUri = metadata[balance.tokenId].gateway;
      replyThread(_twitter, _tweet, balanceMessage, imageUri);
    }
  } catch (err) {
    _twitter.v2.reply("Error Code: 44196397", _tweet.data.id);
  }
};

async function replyThread(_twitter, _tweet, _message, _uri) {
  // tweet image
  let mediaPath;
  try {
    mediaPath = await downloadMedia(_uri);
    const mediaId = await _twitter.v1.uploadMedia(mediaPath);
    // https://github.com/PLhery/node-twitter-api-v2/blob/e56d7811363df193abcd141440c4fbe472bc2279/src/types/v2/tweet.definition.v2.ts#L175
    await _twitter.v2.reply(_message, _tweet.data.id, { media: { media_ids: [mediaId] } });
  } finally {
    await deleteMedia(mediaPath);
  }
}
