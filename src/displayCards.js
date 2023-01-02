const metadata = require("./metadata.json");
const getBalancesOf = require("./getBalancesOf");
const downloadMedia = require("./downloadMedia");
const deleteMedia = require("./deleteMedia");

/*
 * Reply with ALL cards owned by player
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * @param {String} _address - Address of player
 * */
module.exports = async function displayCards(_twitter, _tweet, _address) {
  // fetch balances from subgraph
  const balancesOf = await getBalancesOf(_address);
  for (let balance of balancesOf) {
    const amount = balance.amount;
    const tokenId = balance.tokenId;
    const name = metadata[tokenId].description;
    const imageUri = metadata[tokenId].cacheImage;

    let mediaPath;
    try {
      mediaPath = await downloadMedia(imageUri);
      const mediaId = await _twitter.v1.uploadMedia(mediaPath);
      const message = `${name} \nID: ${tokenId} \nAmount: ${amount}`;
      // https://github.com/PLhery/node-twitter-api-v2/blob/e56d7811363df193abcd141440c4fbe472bc2279/src/types/v2/tweet.definition.v2.ts#L175
      await _twitter.v2.reply(message, _tweet.data.id, { media: { media_ids: [mediaId] } });
    } finally {
      await deleteMedia(mediaPath);
    }
  }
};
