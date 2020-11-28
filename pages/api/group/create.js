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

  const review = await prisma.create
    .create({
      data: {
        user: {
          connect: {
            id: Number(user.id),
          },
        },
        public: req.body.public,
        inviteonly: req.body.inviteonly,
        name: req.body.title,
        description: req.body.description || "",
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
