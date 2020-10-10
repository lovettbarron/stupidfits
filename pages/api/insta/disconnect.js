import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import { PostsInsightsFeed } from "instagram-private-api";
import cloudinary from "cloudinary";
const prisma = new PrismaClient();
import { Instagram, Media } from "../../../lib/insta";

export default async function handle(req, res) {
  const id = req.query.id;
  const session = await getSession({ req });
  console.log("Saving media", req.body);

  const media = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      instagram: null,
      instagramlong: null,
      instagramrefresh: null,
    },
  });
  res.json(media);
}
