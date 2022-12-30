module.exports = async function Register(twitter, tweet) {
  // Ignore retweets or self-sent tweets
  const isRetweet = tweet.data.referenced_tweets?.some((tweet) => tweet.type === "retweeted") ?? false;
  if (isRetweet || tweet.data.author_id === twitter.currentUser()) return;
  // get user
  const user = await twitter.v2.users([tweet.data.author_id]);
  // get address "@dexoshi register 0x1234567890"
  const address = tweet.data.text.split(" ")[2];
  // reply confirmation
  await twitter.v2.reply(`@${user.data[0].username} has regestered address ${address}`, tweet.data.id);
};
