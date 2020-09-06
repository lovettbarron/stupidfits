import InstagramBasicDisplayApi from "instagram-basic-display";

export default async function handle(req, res) {
  let ig;
  try {
    ig = await new InstagramBasicDisplayApi({
      appId: process.env.INSTAGRAM_CLIENT_ID,
      redirectUri: `${process.env.HOST}/api/auth/insta`,
      appSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    });
  } catch (err) {
    console.log(err);
  }

  console.log(ig.authorizationUrl);
  // -> generates a user-code after successfull authorization

  const code = ig.authorizationUrl;

  // Temp
  // IGQVJVUnBtT21HNUlheVBXQTZAIYlZAaNkFVcUlMUThTRV9tTjQxVmtUZAkp5d3RidEpaZAmNvYkRtWDdXT3hpMWdnbkZAqNjkzaHRkZA0lqZAXFrS0pOWUVqb3dENDBielBZAZAHBzRHhqanpoREgtUVUzYkl0RgZDZD

  ig.retrieveToken(code).then((data) => {
    const token =
      "IGQVJVUnBtT21HNUlheVBXQTZAIYlZAaNkFVcUlMUThTRV9tTjQxVmtUZAkp5d3RidEpaZAmNvYkRtWDdXT3hpMWdnbkZAqNjkzaHRkZA0lqZAXFrS0pOWUVqb3dENDBielBZAZAHBzRHhqanpoREgtUVUzYkl0RgZDZD";

    ig.retrieveUserNode(token).then((data) => {
      console.log(data);
      res.json(data);
    });
  });
}
