/**
 * When player tweets "@dexoshi help", reply with help message
 */
module.exports = async function handleHelp(_twitter, _tweet) {
  const message = `
🤓 Get info
@dexoshi info <@TWITTER_HANDLE>

🎁 Gift a token
@dexoshi gift <@TWITTER_HANDLE> <TOKEN_ID>

🔥 Burn a token
@dexoshi burn <TOKEN_ID>

📨 Transfer to address
@dexoshi transfer <0xADDRESS> <TOKEN_ID> <AMOUNT>
`;

  _twitter.v2.reply(message, _tweet.data.id);
};
