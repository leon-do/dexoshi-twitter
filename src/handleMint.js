const { contract } = require("./contract");
const replyWithCard = require("./replyWithCard");
const metadata = require("./metadata.json");

/*
 * Example tweet to mint: "RT @dexoshi: @dexoshi mint 8"
 * Mint anyone who retweets this tweet
 */
module.exports = async function handleMint(_twitter, _tweet) {
  // get twitter handle from twitter id
  const toHandle = await _twitter.v2.users([_tweet.data.author_id]);
  // get address from twitter id
  const toAddress = await contract["twitterIdToAddress"](_tweet.data.author_id);
  // get tokenId from command: "RT @dexoshi: @dexoshi mint 8"
  const tokenId = _tweet.data.text.split(" ")[4];
  // only mint if balance is 0
  const balanceOf = await contract["balanceOf"](toAddress, tokenId);
  if (balanceOf > 0) return _twitter.v2.reply(`Mint Error: @${toHandle.data[0].username} already owns \nCard ID: ${tokenId}.`, _tweet.data.id);
  // get description
  const description = metadata[tokenId].description;
  // mint new token
  const { hash } = await contract["adminMint"](toAddress, tokenId, 1);
  // reply with tx hash
  const message = `@${toHandle.data[0].username} recieved \nName: ${description} \nCard ID: ${tokenId} ${process.env.BLOCK_EXPLORER}/tx/${hash}`;
  // display card
  await replyWithCard(_twitter, _tweet, message, tokenId);
};
