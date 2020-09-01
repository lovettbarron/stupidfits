import InstagramBasicDisplayApi from "instagram-basic-display";

export default async function handle(req, res) {
  const ig = new InstagramBasicDisplayApi({
    appId: process.env.INSTAGRAM_CLIENT_ID,
    redirectUri: process.env.HOST,
    appSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  });

  console.log(ig.authorizationUrl);
  // -> generates a user-code after successfull authorization

  const code = ig.authorizationUrl;

  ig.retrieveToken(code).then((data) => {
    const token = data.access_token;

    ig.retrieveUserNode(token).then((data) => {
      console.log(data);
      res.json(data);
    });
  });
}
