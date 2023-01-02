const { contract } = require("./contract");
const displayCard = require("./displayCard");

/*
 * Example tweet to mint: "RT @dexoshi: @dexoshi mint 8"
 * Mint anyone who retweets this tweet
 */
module.exports = async function handleMint(_twitter, _tweet) {
  // call "twitterIdToAddress" to get address on chain
  const toAddress = await contract["twitterIdToAddress"](_tweet.data.author_id);
  // get lastMint
  const lastMint = await contract["lastMint"](toAddress);
  // if last mint is too soon, then return error
  const secondsToMint = 300;
  if (Math.floor(Date.now() / 1000) + secondsToMint < lastMint) {
    const secondsLeft = Math.floor(lastMint - Math.floor(Date.now() / 1000) + secondsToMint);
    const message = `@${_tweet.data.author_id} must wait ${secondsLeft} seconds between mints`;
    return await _twitter.v2.reply(message, _tweet.data.id);
  }
  // get twitter handle from author_id
  const toHandle = await _twitter.v2.users([_tweet.data.author_id]);
  // get tokenId from command: "RT @dexoshi: @dexoshi mint 8"
  const tokenId = _tweet.data.text.split(" ")[4];
  // mint new token
  const tokenUri = `${process.env.TOKEN_URI}/${String(newTokenId).padStart(5, "0")}.json`;
  const { hash } = await contract["adminMint"](address, newTokenId, 1, tokenUri);
  // reply with tx hash
  const message = `Card ID: ${tokenId} is minted to @${toHandle.data[0].username}. ${process.env.BLOCK_EXPLORER}/tx/${hash}`;
  await _twitter.v2.reply(message, _tweet.data.id);
  // display card
  await displayCard(_twitter, _tweet, tokenId);
};
