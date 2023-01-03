const twitter = require("./twitter");
const tweetWithCard = require("./tweetWithCard");
const metadata = require("./metadata.json");

module.exports = async function tweetMint() {
  const tokenId = 55;
  const description = metadata[tokenId].description;
  const message = `@dexoshi mint ${tokenId} available \nName: ${description} \nCard ID: ${tokenId}. \n\nRetweet to claim`;
  tweetWithCard(twitter, message, tokenId);
};
