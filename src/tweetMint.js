const twitter = require("./twitter");
const displayCard = require("./displayCard");

module.exports = async function tweetMint() {
  const tokenId = 0;
  const tweet = await twitter.v2.tweet(`@dexoshi mint ${tokenId} is available. \nRetweet for free claim`);
  await displayCard(twitter, tweet, 0);
};
