const metadata = require("./metadata.json");
const downloadMedia = require("./downloadMedia");
const deleteMedia = require("./deleteMedia");

/*
 * tweet with message and image of card
 * @param {Object} _twitter - _twitter API client
 * @param {String} _message - Tweet message
 * @param {String} _tokenId - Token ID of card
 * */
module.exports = async function tweetWithCard(_twitter, _message, _tokenId) {
  const imageUri = metadata[_tokenId].cacheImage;
  let mediaPath;
  try {
    mediaPath = await downloadMedia(imageUri);
    const mediaId = await _twitter.v1.uploadMedia(mediaPath);
    await _twitter.v2.tweetThread([{ text: _message, media: { media_ids: [mediaId] } }]);
  } finally {
    await deleteMedia(mediaPath);
  }
};
