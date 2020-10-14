import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });

  console.log("Feed", req.query);

  // If user is logged in and this isn't global
  if (req.query.id) {
    // If there is a feed id
    const posts = await prisma.fit
      .findMany({
        where: {
          user: {
            id: Number(req.query.id),
          },
        },
        include: {
          media: true,
          user: true,
          components: { include: { brand: true } },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // console.log(posts);
    res.json(posts);
  } else if (session) {
    const posts = await prisma.fit
      .findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        include: {
          media: true,
          user: true,
          components: { include: { brand: true } },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    // console.log(posts);
    res.json(posts);
  }
}
