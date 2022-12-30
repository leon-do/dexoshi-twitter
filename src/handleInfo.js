const { contract } = require("./contract.js");
const getBalancesOf = require("./getBalancesOf.js");

/*
 * When player tweets "@dexoshi info @elonmusk", reply with players info
 * @param {Object} _twitter - _twitter API client
 * @param {Object} _tweet - Tweet object
 * */
module.exports = async function handleInfo(_twitter, _tweet) {
  // Ignore retweets or self-sent tweets
  const isRetweet = _tweet.data.referenced_tweets?.some((_tweet) => _tweet.type === "retweeted") ?? false;
  if (isRetweet || _tweet.data.author_id === _twitter.currentUser()) return;
  // get twitter handle
  const handle = _tweet.data.text.split(" ")[2].split("@")[1];
  // get twitter user Id
  const user = await _twitter.v2.usersByUsernames([handle]);
  // call "accounts" to get address on chain
  const address = await contract["accounts"](user.data[0].id);
  // query the graph
  const balances = await getBalancesOf(address);
  console.log({ balances });
  // format balances to twitter message
  const balanceMessage = balances.map((val) => `Token ID: ${val.tokenId} \nBalance: ${val.balance} \nURI: ${val.uri}`);
  console.log({ balanceMessage });
  // create message
  const messages = [`Username: ${handle} \nAddress: ${address} \nUnique Cards: ${balances.length}`, ...balanceMessage];
  // reply with message
  for (let message of messages) {
    await _twitter.v2.reply(message, _tweet.data.id);
  }
};
