const twitter = require("./src/twitter");

main();
async function main() {
  // Get user (me)
  const currentUser = twitter.currentUser();

  // https://github.com/PLhery/node-twitter-api-v2/blob/36821932dbde93129168e8b47af4e1e377552bde/doc/basics.md#create-a-client
  const login = await twitter.appLogin();

  // https://github.com/PLhery/node-twitter-api-v2/blob/05c5c1f8c3b13d49f38126fe37a8faa675b53e88/doc/examples.md#stream-tweets-in-real-time
  await login.v2.streamRules();

  // Add rules
  await login.v2.updateStreamRules({
    add: [{ value: "JavaScript" }],
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
    const isRetweet = tweet.data.referenced_tweets?.some((tweet) => tweet.type === "retweeted") ?? false;
    if (isRetweet || tweet.data.author_id === currentUser) return;

    console.log("tweet", JSON.stringify(tweet, null, 2));
  });
}
