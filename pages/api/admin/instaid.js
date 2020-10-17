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
    where: {},
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
        // const { data } = await axios.get(`${m.url}?__a=1`);

        const fetchurl = `https://api.instagram.com/oembed/?callback=&url=${m.url}`;

        const { data } = await axios.get(fetchurl);

        const realid = data.media_id; // data.graphql.shortcode_media.id

        console.log(m.id, realid);

        const up = await prisma.media.update({
          where: {
            id: m.id,
          },
          data: {
            insta_id: realid,
          },
        });

        r.push(`${m.id} update insta_id from ${m.insta_id} to ${up.insta_id}`);
        console.log(
          `${m.id} update insta_id from ${m.insta_id} to ${up.insta_id}`
        );
        completed++;
        if (completed >= media.length) res.json(r);
      }
    } catch (e) {
      console.log(e);
      r.push(`${m.id} failed to update: ${e}`);
    }
  });
  // res.json(r);
}
