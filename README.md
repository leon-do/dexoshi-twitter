# Dexoshi

## Tweet Commands

### Info

`info <TWITTER_HANDLE>` creates a thread of a user's cards

Commands:

```
# Get info about @user
@dexoshi info <@TWITTER_HANDLE>

# Gift to @user token ID #1
@dexoshi gift <@TWITTER_HANDLE> 1

# Burn token ID 1
@dexoshi burn <TOKEN_ID>

# Transfer to 0x address
@dexoshi trasnfer <ADDRESS> <TOKEN_ID> <AMOUNT>
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

## Metadata

https://nftstorage.link/ipfs/bafybeie7bjhof6patydr7i6nv5cj4tbujz2t3ahazxaie5rvyjdnduoq4m/16103.json
