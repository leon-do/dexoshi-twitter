/**
 * When player tweets "@dexoshi help", reply with help message
 */
module.exports = async function handleHelp(_twitter, _tweet) {
  const message = `
🤓 Get info
@dexoshi info <@TWITTER_HANDLE>
  
🎁 Gift token
@dexoshi gift <@TWITTER_HANDLE> <TOKEN_ID>
  
🫶 Merge token 1 + 2 = 3
@dexoshi burn <TOKEN_ID_1> <TOKEN_ID_2>
  
📨 Transfer to address
@dexoshi transfer <0xADDRESS> <TOKEN_ID> <AMOUNT>
`;

  _twitter.v2.reply(message, _tweet.data.id);
};
