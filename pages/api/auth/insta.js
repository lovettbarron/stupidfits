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

  // const instaurl = `https://api.instagram.com/oauth/`


  
  //   const token = await fetch(
  //     `${instaurl}/`
  //   );
  //   insta = await res.json();
  //   // console.log("insta", insta);


  // console.log("Insta return", req.query);
  const code = req.query.code; // Auth code
try {

  const {token} = await ig.retrieveToken(code);
  const { access_token} = await  ig.retrieveLongLivedToken(token)

  const instaUpdate = await prisma.user.update({
          where: { email: session.user.email },
          data: {
            instagramlong: access_token,
          },
        })
      
        res.writeHead(302, {
          'Location': '/feed'
        });
        res.end();

      } catch (err) {
      res.json("error getting token",err)
    };


  // ig.retrieveToken(code).then((data) => {
  //   const token = data.token; // Access Token
  //   console.log("Get token",token)

  //   ig.retrieveLongLivedToken(token).then((d) => {
  //     console.log("Got Long token", d.access_token)
  //     const instaUpdate = prisma.user
  //       .update({
  //         where: { email: session.user.email },
  //         data: {
  //           instagramlong: d.access_token,
  //         },
  //       })
  //       .then((u) => {
  //         // res.json(u);
  //         // Redirect to Feed
  //         res.writeHead(302, {
  //           'Location': '/feed'
  //         });
  //         res.end();
  //       }).catch(err => {
  //     res.json("error saving user",err)
  //   });;
  //   }).catch(err => {
  //     res.json("error long token",err)
  //   });
  // }).catch(err => {
  //     res.json("error getting token",err)
  //   });;
}
