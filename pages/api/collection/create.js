import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const review = await prisma.collection
    .create({
      data: {
        user: {
          connect: {
            id: Number(user.id),
          },
        },
        published: req.body.published,
        public: req.body.public,
        oneperuser: req.body.oneperuser,
        title: req.body.title,
        description: req.body.description || "",
        fits: req.body.fit
          ? {
              connect: {
                id: Number(req.body.fit),
              },
            }
          : undefined,
        group: req.body.group
          ? {
              connect: {
                id: Number(req.body.group),
              },
            }
          : undefined,
        slug: req.body.title
          .toLowerCase()
          .split(" ")
          .join("-")
          .replace(/[^\w\s-_]/gi, ""),
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(review);
}
