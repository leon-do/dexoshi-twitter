require("dotenv").config();
const { TwitterApi } = require("twitter-api-v2");

// https://www.npmjs.com/package/twitter-api-v2
module.exports = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
