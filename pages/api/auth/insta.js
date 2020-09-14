import InstagramBasicDisplayApi from "instagram-basic-display";
import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  let ig;
  const session = await getSession({ req });
  // Generate the client
  try {
    ig = await new InstagramBasicDisplayApi({
      appId: process.env.INSTAGRAM_CLIENT_ID,
      redirectUri: `${process.env.HOST}/api/auth/insta`,
      appSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Insta return", req.query);
  const code = req.query.code;

  ig.retrieveToken(code).then((data) => {
    const token = req.data.token;
    console.log("Get ")

    ig.retrieveLongLivedToken(token).then((d) => {
      const instaUpdate = prisma.user
        .update({
          where: { email: session.user.email },
          data: {
            instagramlong: d.access_token,
          },
        })
        .then((u) => {
          // res.json(u);
          // Redirect to Feed
          res.writeHead(302, {
            'Location': '/feed'
          });
          res.end();
        });
    });
  });
}
