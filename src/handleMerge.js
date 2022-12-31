const { contract } = require("./contract.js");
const metadata = require("./metadata.json");
const getBalancesOf = require("./getBalancesOf.js");
const displayCard = require("./displayCard.js");

/*
 * When player tweets "@dexoshi merge 1 2", merge 1 + 2 to get 3
 * https://user-images.githubusercontent.com/19412160/210153490-cf3244a8-18bd-4bf1-a53f-4b44fca9b177.png
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleMerge(_twitter, _tweet) {
  try {
    // get twitter handle from author_id
    const fromHandle = await _twitter.v2.users([_tweet.data.author_id]);
    // get address from twitter id
    const address = await contract["twitterIdToAddress"](_tweet.data.author_id);
    // get list of token ids to merge
    const tokenIds = _tweet.data.text.split(" ").slice(2);
    // check if the player has the tokens to merge
    const canMerge = await hasTokens(address, tokenIds);
    if (!canMerge) return _twitter.v2.reply("Error Code: 933113177197264896", _tweet.data.id);
    // burn merged tokens
    await burnTokens(address, tokenIds);
    // calculate new tokenId
    const newTokenId = tokenIds.reduce((a, b) => Number(a) + Number(b), 0) % metadata.length;
    // mint new token
    const tokenUri = `${process.env.TOKEN_URI}/${String(newTokenId).padStart(5, "0")}.json`;
    const receipt = await contract["adminMint"](address, newTokenId, 1, tokenUri);
    // reply with tx hash
    const message = `@${fromHandle.data[0].username} merged ${tokenIds.join(" + ")} to get ID: ${newTokenId} ${process.env.BLOCK_EXPLORER}/tx/${receipt.hash}`;
    await _twitter.v2.reply(message, _tweet.data.id);
    // reply with card
    await displayCard(_twitter, _tweet, newTokenId);
  } catch (err) {
    console.error(err);
    _twitter.v2.reply("Error Code: 1098445789368479744", _tweet.data.id);
  }
};

async function hasTokens(_address, _tokenIds) {
  try {
    // get true list of tokenIds from the graph
    const tokenIds = (await getBalancesOf(_address)).map((val) => val.tokenId);
    // check if _tokensIds player wants are in tokenIds
    for (const tokenId of _tokenIds) {
      if (!tokenIds.includes(tokenId)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function burnTokens(_address, _tokenIds) {
  for (const tokenId of _tokenIds) {
    const { hash } = await contract["adminBurn"](_address, tokenId, 1);
    // console.log(hash);
  }
}
