require("dotenv").config();
require("./src/expressServer");
const twitter = require("./src/twitter");
const tweetMint = require("./src/tweetMint");
const handleBurn = require("./src/handleBurn");
const handleGift = require("./src/handleGift");
const handleHelp = require("./src/handleHelp");
const handleInfo = require("./src/handleInfo");
const handleMerge = require("./src/handleMerge");
const handleMint = require("./src/handleMint");
const handleTransfer = require("./src/handleTransfer");

// startMinter();
startListener();

tweetMint()
/*
 * Start minting every 5 minutes
 */
async function startMinter() {
  setInterval(async () => {
    await tweetMint();
  }, 1000 * 60 * 5);
}

/*
 * Start listening for tweets and handle them
 */
async function startListener() {
  // get twitter handle: @dexoshi
  const adminHandle = `@${(await twitter.currentUserV2()).data.username}`;

  // https://github.com/PLhery/node-twitter-api-v2/blob/36821932dbde93129168e8b47af4e1e377552bde/doc/basics.md#create-a-client
  const login = await twitter.appLogin();

  // https://github.com/PLhery/node-twitter-api-v2/blob/05c5c1f8c3b13d49f38126fe37a8faa675b53e88/doc/examples.md#stream-tweets-in-real-time
  const rules = await login.v2.streamRules();

  // delete existing rules
  await login.v2.updateStreamRules({
    delete: { ids: rules.data.map((rule) => rule.id) },
  });

  // add new rules
  await login.v2.updateStreamRules({
    add: [{ value: adminHandle, tag: adminHandle }],
  });

  // https://github.com/PLhery/node-twitter-api-v2/blob/c8dacc7c0f85bc45a41c678dfeee1ebde31dd451/doc/streaming.md#specific-api-v2-implementations
  const stream = await login.v2.searchStream({
    "tweet.fields": ["referenced_tweets", "author_id"],
    expansions: ["referenced_tweets.id"],
  });

  // Enable auto reconnect
  stream.autoReconnect = true;

  stream.on("data event content", async (tweet) => {
    // console.log("\n", JSON.stringify(tweet, null, 2));
    // Example: if tweet === "@dexoshi mint" then handelMint(). the 🥩 & 🥔
    if (tweet.data.text.indexOf(`${adminHandle} burn`) === 0) handleBurn(twitter, tweet);
    if (tweet.data.text.indexOf(`${adminHandle} gift`) === 0) handleGift(twitter, tweet);
    if (tweet.data.text.indexOf(`${adminHandle} help`) === 0) handleHelp(twitter, tweet);
    if (tweet.data.text.indexOf(`${adminHandle} info`) === 0) handleInfo(twitter, tweet);
    if (tweet.data.text.indexOf(`${adminHandle} merge`) === 0) handleMerge(twitter, tweet);
    if (tweet.data.text.indexOf(`${adminHandle} transfer`) === 0) handleTransfer(twitter, tweet);
    if (tweet.data.text.indexOf(`RT ${adminHandle}: ${adminHandle} mint`) === 0) handleMint(twitter, tweet);
  });
}
