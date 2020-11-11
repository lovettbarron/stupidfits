import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  console.log("Create Fit", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const review = await prisma.review.create({
    data: {
      user: {
        connect: {
          id: Number(user.id),
        },
      },
      published: false,
      title: req.body.title,
      review: "",
      slug: req.body.title.toLowerCase().replace(/[^\w\s-_]/gi, ""),
    },
  });
  res.json(review);
}
