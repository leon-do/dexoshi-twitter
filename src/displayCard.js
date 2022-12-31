const metadata = require("./metadata.json");
const downloadMedia = require("./downloadMedia");
const deleteMedia = require("./deleteMedia");

/*
 * Reply with 1 card owned by player
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * @param {String} _tokenId - Token ID of card
 * */
module.exports = async function displayCards(_twitter, _tweet, _tokenId) {
  const imageUri = metadata[_tokenId].gateway;
  const name = metadata[_tokenId].description;
  let mediaPath;
  try {
    mediaPath = await downloadMedia(imageUri);
    const mediaId = await _twitter.v1.uploadMedia(mediaPath);
    const message = `${name} \nID: ${_tokenId}`;
    // https://github.com/PLhery/node-twitter-api-v2/blob/e56d7811363df193abcd141440c4fbe472bc2279/src/types/v2/tweet.definition.v2.ts#L175
    await _twitter.v2.reply(message, _tweet.data.id, { media: { media_ids: [mediaId] } });
  } finally {
    await deleteMedia(mediaPath);
  }
};
