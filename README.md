# Dexoshi

## Tweet Commands

### Info

`info <TWITTER_HANDLE>` creates a thread of a user's cards

Commands:

```
# Get @elonmusk's info
@dexoshi info @elonmusk

# Send to @elonmusk card ID #1
@dexoshi send @elonmusk 1
```

## Docs

```javascript
const twitter = require("./src/twitter");
const downloadMedia = require("./src/downloadMedia");
const deleteMedia = require("./src/deleteMedia");

tweet();
async function tweet() {
  // tweet
  await twitter.v2.tweet("Hello World");

  // tweet thread
  await twitter.v2.tweetThread(["zero", "one"]);

  // tweet image
  let mediaPath;
  try {
    mediaPath = await downloadMedia("https://i.imgur.com/Xs2XCZd.jpeg");
    const mediaId = await twitter.v1.uploadMedia(mediaPath);
    await twitter.v1.tweet("A moon", { media_ids: mediaId });
  } finally {
    await deleteMedia(mediaPath);
  }
}
```
