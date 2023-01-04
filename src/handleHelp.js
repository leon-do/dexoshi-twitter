/**
 * When player tweets "@dexoshi help", reply with help message
 */
module.exports = async function handleHelp(_twitter, _tweet) {
  const message = `
🤓 Get info
@dexoshi info <@TWITTER_HANDLE>
  
🎁 Gift token
@dexoshi gift <@TWITTER_HANDLE> <CARD_ID>
  
🫶 Merge token 2 + 3 = 6
@dexoshi burn <CARD_ID_1> <CARD_ID_2>
  
📨 Transfer to address
@dexoshi transfer <0xADDRESS> <CARD_ID> <AMOUNT>
`;

  _twitter.v2.reply(message, _tweet.data.id);
};
