// import { PrismaClient } from "@prisma/client";
// import { getSession, session } from "next-auth/client";
// import axios from "axios";
// import querystring from "querystring";
// import * as cloudinary from "cloudinary";

// const prisma = new PrismaClient();

// export default async function handle(req, res) {
//   // console.log("Session", session);
//   const session = await getSession({ req });
//   const r = [];
//   if (session.user.email !== "alb@andrewlb.com") return res.status(402);

//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });

//   const media = await prisma.media.findMany({
//     where: {},
//     include: {
//       fit: {
//         include: {
//           user: true,
//         },
//       },
//     },
//   });

//   media.forEach(async (m) => {
//     try {
//       if (!m.fit.user.instagramlong) {
//         r.push(`${m.id} has no instagram token to make request`);
//         return;
//       }

//       const uploadpath = m.image;

//       const requestData = {
//         fields: "media_url",
//         access_token: m.fit.user.instagramlong,
//       };
//       const i = await axios.get(
//         `https://graph.instagram.com/${instaId}?${querystring.stringify(
//           requestData
//         )}`
//       );

//       const cloudurl = await cloudinary.uploader.upload(uploadpath, {
//         public_id: `stupidfits/instagram/${i.media_url}`,
//       });

//       const media = await prisma.media.update({
//         where: {
//           id: m.id,
//         },
//         data: {
//           cloudinary: (cloudurl && cloudurl.public_id) || null,
//         },
//       });

//       r.push(`${media.id} update with ${media.cloudinary}`);
//     } catch (e) {
//       console.log(e);
//       r.push(`${media.id} failed to update: ${e}`);
//     }
//   });
//   res.json(r);
// }
