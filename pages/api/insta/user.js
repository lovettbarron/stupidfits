import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import { PostsInsightsFeed } from "instagram-private-api";
import cloudinary from "cloudinary";
const prisma = new PrismaClient();
import { Instagram, Media } from "../../../lib/insta";

export default async function handle(req, res) {
  const { id, page } = req.query;
  const session = await getSession({ req });
  let user = null;
  try {
    user = await prisma.user
      .findOne({
        where: { id: session.user.id },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  } catch (e) {
    console.log("err");
  }

  // console.log("Fetching instagram user with token", user.instagramlong);
  var instagram = new Instagram(user.instagramlong);
  const usero = await instagram.fetchSelf();
  console.log("Found User", usero);
  res.json(usero);
}
