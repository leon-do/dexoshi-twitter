const { contract } = require("./contract");
const getBalancesOf = require("./getBalancesOf");
const replyWithCard = require("./replyWithCard");
const metadata = require("./metadata.json");

/*
 * When player tweets "@dexoshi merge 1 2", merge 1 & 2
 * https://user-images.githubusercontent.com/19412160/210154115-78f83489-7e56-4f7f-99fc-d52fd231fab5.png
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
    const newTokenId = tokenIds.reduce((a, b) => Number(a) * Number(b), 1) % metadata.length;
    // get descripton 
    const description = metadata[tokenId].description;
    // mint new token
    const { hash } = await contract["adminMint"](address, newTokenId, 1);
    // reply with tx hash
    const message = `@${fromHandle.data[0].username} merged ${tokenIds.join(" + ")} to get \nName: ${description} \nCard ID: #${newTokenId} \n${process.env.BLOCK_EXPLORER}/tx/${hash}`;
    // reply with card
    await replyWithCard(_twitter, _tweet, message, newTokenId);
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
