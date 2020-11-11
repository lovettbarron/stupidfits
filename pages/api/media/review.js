import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (!req.body.imgs || req.body.imgs.length < 1) {
    res.status(400).json({ error: "No media refs" });
    return null;
  }

  const session = await getSession({ req });
  console.log("Adding Media to Review", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const d = new Date();

  let MediaArray = [];

  for (let c of req.body.imgs) {
    MediaArray.push({
      insta_id: null,
      username: user.username,
      timestamp: Math.floor(d.getTime() / 1000),
      cloudinary: c,
      image: null,
      url: null,
      description: "",
    });
  }

  console.log("Making with media", MediaArray);

  // Set path

  const review = await prisma.review.update({
    where: {
      id: Number(req.body.id),
    },
    data: {
      media: { create: MediaArray },
    },
    include: {
      media: true,
    },
  });
  res.json(review);
}
