const twitter = require("./twitter");
const tweetWithCard = require("./tweetWithCard");
const metadata = require("./metadata.json");

module.exports = async function tweetMint() {
  // list of tokenIds to mint
  const mintTokenIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // pick random tokenId from
  const tokenId = mintTokenIds[Math.floor(Math.random() * mintTokenIds.length)];
  const description = metadata[tokenId].description;
  const message = `@dexoshi mint ${tokenId} available \nName: ${description} \nCard ID: #${tokenId} \n\nRetweet to mint`;
  tweetWithCard(twitter, message, tokenId);
};
