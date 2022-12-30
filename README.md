# Twitter Bot Demo

## Developer.twitter.com

https://developer.twitter.com/en

![](https://user-images.githubusercontent.com/19412160/209895563-fa79c463-a241-441e-8130-63660d2c3d0f.png)

![](https://user-images.githubusercontent.com/19412160/209895571-97e3ff39-4303-4a85-a27f-0160da40583d.png)

![](https://user-images.githubusercontent.com/19412160/209895574-3ff7b4b0-dd57-4d8d-8b41-cf7c2ec539f3.png)

![](https://user-images.githubusercontent.com/19412160/209895578-ba0dc4b6-ec51-40e1-9e97-373c19bb8a37.png)

Add these values to `.env`

```
TWITTER_API_KEY=Y4LYUqhVDn7wqYSSgjRLQbwFW
TWITTER_API_SECRET=qaOYTc5ZwPvWkuCcLQJrQSXmoEWH8y8UrbBLQsgsT2kIPCOEwC
TWITTER_ACCESS_TOKEN=1215122943765774337-7OZe6nYHpvCc9Oi1v5Xd5Wzod4PTEb
TWITTER_ACCESS_SECRET=CIzpIjdquDGclSIXEWCgswgPyIBXvKRddd2ctoFlzQHIv
```

## Docs

```javascript
const twitter = require("./src/twitter");
const downloadMedia = require("./src/downloadMedia");
const deleteMedia = require("./src/deleteMedia");

tweet();
async function tweet() {
  // tweet
  await twitter.v1.tweet("Hello World");

  // tweet thread
  await twitter.v1.tweetThread(["one", "two", "three"]);

  // tweet image
  const mediaPath = await downloadMedia("https://i.imgur.com/Xs2XCZd.jpeg");
  const mediaId = await twitter.v1.uploadMedia(mediaPath);
  await twitter.v1.tweet("A moon", { media_ids: mediaId });
  await deleteMedia(mediaPath);
}
```
