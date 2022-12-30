const { contract } = require("./contract.js");

/*
 * When player tweets "@dexoshi register 0xd2320868324ab1898ccd2cdf2921effcc9b4b2f5", call "setAccount" function on chain
 * This will map the player's Twitter username to their wallet address
 * @param {Object} twitter - Twitter API client
 * @param {Object} tweet - Tweet object
 * */
module.exports = async function handleSetAccount(twitter, tweet) {
  // Ignore retweets or self-sent tweets
  const isRetweet = tweet.data.referenced_tweets?.some((tweet) => tweet.type === "retweeted") ?? false;
  if (isRetweet || tweet.data.author_id === twitter.currentUser()) return;
  // get user
  const user = await twitter.v2.users([tweet.data.author_id]);
  // get address "@dexoshi register 0xd2320868324ab1898ccd2cdf2921effcc9b4b2f5"
  const address = tweet.data.text.split(" ")[2];
  // call "setAccount" function on chain
  const receipt = await contract["setAccount"](tweet.data.author_id, address);
  // create message
  const message = `@${user.data[0].username} has regestered address ${address}. ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
  // reply with message
  await twitter.v2.reply(message, tweet.data.id);
};
