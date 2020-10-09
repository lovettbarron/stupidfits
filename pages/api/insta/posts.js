import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import { PostsInsightsFeed } from "instagram-private-api";
import cloudinary from "cloudinary";
const prisma = new PrismaClient();

import { Instagram, Media } from "../../../lib/insta";

export default async function handle(req, res) {
  const { id, page } = req.query;

  const session = await getSession({ req });
  console.log("Saving media", req.body);

  var instagram = new Instagram("VALID_TOKEN");
  const user = await getUserData(id);
  res.json(user);
}
