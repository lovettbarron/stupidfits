import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  console.log("Create Fit", session.user.email, req.body);

  const uploadpath = req.body.media_url;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudurl = await cloudinary.uploader.upload(uploadpath, {
    public_id: `stupidfits/instagram/${req.body.id}`,
  });

  const d = new Date(Date.parse(req.body.timestamp));
  // Set path
  const media = await prisma.fit
    .create({
      data: {
        user: {
          connect: {
            email: session.user.email,
          },
        },
        media: {
          create: {
            insta_id: req.body.id,
            username: req.body.username,
            timestamp: Math.floor(d.getTime() / 1000),
            cloudinary: (cloudurl && cloudurl.public_id) || null,
            image: req.body.media_url,
            url: req.body.permalink,
            description: req.body.caption || "",
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(media);
}
