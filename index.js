require("dotenv").config();
const twitter = require("./src/twitter");
const handleBurn = require("./src/handleBurn");
const handleGift = require("./src/handleGift");
const handleHelp = require("./src/handleHelp");
const handleInfo = require("./src/handleInfo");
const handleMerge = require("./src/handleMerge");
const handleTransfer = require("./src/handleTransfer");

main();
async function main() {
  // https://github.com/PLhery/node-twitter-api-v2/blob/36821932dbde93129168e8b47af4e1e377552bde/doc/basics.md#create-a-client
  const login = await twitter.appLogin();

  // https://github.com/PLhery/node-twitter-api-v2/blob/05c5c1f8c3b13d49f38126fe37a8faa675b53e88/doc/examples.md#stream-tweets-in-real-time
  await login.v2.streamRules();

  // Add rules
  await login.v2.updateStreamRules({
    add: [{ value: "@dexoshi" }],
  });

  // https://github.com/PLhery/node-twitter-api-v2/blob/c8dacc7c0f85bc45a41c678dfeee1ebde31dd451/doc/streaming.md#specific-api-v2-implementations
  const stream = await login.v2.searchStream({
    "tweet.fields": ["referenced_tweets", "author_id"],
    expansions: ["referenced_tweets.id"],
  });

  // Enable auto reconnect
  stream.autoReconnect = true;

  stream.on("data event content", async (tweet) => {
    // Ignore retweets or self-sent tweets
    const isRetweet = tweet.data.referenced_tweets?.some((_tweet) => tweet.type === "retweeted") ?? false;
    if (isRetweet || tweet.data.author_id === twitter.currentUser()) return;

    // console.log("\n", JSON.stringify(tweet, null, 2));

    // example tweet to get info: "@dexoshi info"
    const command = tweet.data.text.split(" ")[1];

    // the 🥩 & 🥔
    if (command === "burn") handleBurn(twitter, tweet);
    if (command === "gift") handleGift(twitter, tweet);
    if (command === "help") handleHelp(twitter, tweet);
    if (command === "info") handleInfo(twitter, tweet);
    if (command === "merge") handleMerge(twitter, tweet);
    if (command === "transfer") handleTransfer(twitter, tweet);
  });
}
