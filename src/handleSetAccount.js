const { contract } = require("./contract.js");

/*
 * When player tweets "@dexoshi register 0xd2320868324ab1898ccd2cdf2921effcc9b4b2f5", call "setAccount" function on chain
 * This will map the player's Twitter username to their wallet address
 * @param {Object} _twitter - Twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleSetAccount(_twitter, _tweet) {
  try {
    // Ignore retweets or self-sent tweets
    const isRetweet = _tweet.data.referenced_tweets?.some((_tweet) => _tweet.type === "retweeted") ?? false;
    if (isRetweet || _tweet.data.author_id === _twitter.currentUser()) return;
    // get user
    const user = await _twitter.v2.users([_tweet.data.author_id]);
    // get address "@dexoshi register 0xd2320868324ab1898ccd2cdf2921effcc9b4b2f5"
    const address = _tweet.data.text.split(" ")[2];
    // call "setAccount" function on chain
    const receipt = await contract["setAccount"](_tweet.data.author_id, address);
    // create message
    const message = `@${user.data[0].username} has regestered address ${address}. ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
    // reply with message
    _twitter.v2.reply(message, _tweet.data.id);
  } catch (err) {
    // get first 280 characters of error message
    const message = err.message.slice(0, 280);
    _twitter.v2.reply(message, _tweet.data.id);
  }
};
