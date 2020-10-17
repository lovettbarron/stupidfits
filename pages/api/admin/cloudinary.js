import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import axios from "axios";
import querystring from "querystring";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  // console.log("Session", session);
  const session = await getSession({ req });
  const r = [];
  if (session.user.email !== "alb@andrewlb.com") return res.status(402);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const media = await prisma.media.findMany({
    where: {
      cloudinary: undefined,
    },
    include: {
      fit: {
        include: {
          user: true,
        },
      },
    },
  });

  let completed = 0;

  await media.forEach(async (m) => {
    try {
      if (!m.fit.user.instagramlong) {
        r.push(`${m.id} has no instagram token to make request`);
        completed++;
        if (completed >= media.length) res.json(r);
      } else {
        // const instaId = m.url.split("/p/")[1].replace("/", "");

        const uploadpath = m.image;

        // const requestData = {
        //   fields: "id,media_type,media_url,owner,timestamp",
        //   access_token: `${process.env.FACEBOOK_CLIENT_ID}|${m.fit.user.instagramlong}`,
        // };
        // const i = await axios.get(
        //   `https://graph.instagram.com/${m.insta_id}?${querystring.stringify(
        //     requestData
        //   )}`
        // );

        const i = await axios.get(
          `https://graph.instagram.com/${m.insta_id}?fields=id,media_type,media_url,owner,timestamp&access_token=${process.env.FACEBOOK_CLIENT_ID}|${m.fit.user.instagramlong}`
        );

        const cloudurl = await cloudinary.uploader.upload(uploadpath, {
          public_id: `stupidfits/instagram/${i.media_url}`,
        });

        const up = await prisma.media.update({
          where: {
            id: m.id,
          },
          data: {
            cloudinary: (cloudurl && cloudurl.public_id) || null,
          },
        });
        r.push(`${m.id} update with ${up.cloudinary}`);
      }
      completed++;
      if (completed >= media.length) res.json(r);
    } catch (e) {
      console.log(e);
      r.push(`${m.id} failed to update: ${e}`);
    }
  });
  // res.json(r);
}
