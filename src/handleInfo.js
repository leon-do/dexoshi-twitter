const { contract } = require("./contract.js");
const getBalancesOf = require("./getBalancesOf.js");
const downloadMedia = require("./downloadMedia");
const deleteMedia = require("./deleteMedia");

/*
 * When player tweets "@dexoshi info @elonmusk", reply with players info
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleInfo(_twitter, _tweet) {
  try {
    // Ignore retweets or self-sent tweets
    const isRetweet = _tweet.data.referenced_tweets?.some((_tweet) => _tweet.type === "retweeted") ?? false;
    if (isRetweet || _tweet.data.author_id === _twitter.currentUser()) return;
    // get twitter handle
    const handle = _tweet.data.text.split(" ")[2].split("@")[1];
    // get twitter user Id
    const user = await _twitter.v2.usersByUsernames([handle]);
    // call "accounts" to get address on chain
    const address = await contract["accounts"](user.data[0].id);
    // query the graph
    const balances = await getBalancesOf(address);

    // reply with message
    for (let balance of balances) {
      const balanceMessage = `Token ID: ${balance.tokenId} \nAmount: ${balance.amount}`;
      replyBalances(_twitter, _tweet, balanceMessage, balance.uri);
    }
  } catch (err) {
    _twitter.v2.reply("Error Code: 44196397", _tweet.data.id);
  }
};

async function replyBalances(_twitter, _tweet, _message, _uri) {
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
