const twitter = require("./twitter");
const tweetWithCard = require("./tweetWithCard");
const metadata = require("./metadata.json");

module.exports = async function tweetMint() {
  // pick random tokenId from 0 to 20000. make sure it's divisible by 10
  const tokenId = Math.floor((Math.random() * 20000) / 10) * 10;
  const description = metadata[tokenId].description;
  const message = `@dexoshi mint ${tokenId} available \nName: ${description} \nCard ID: #${tokenId} \n\nRetweet to mint`;
  tweetWithCard(twitter, message, tokenId);
};
