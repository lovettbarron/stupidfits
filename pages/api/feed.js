import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  // console.log("Session", session);

  if (session) {
    const posts = await prisma.fit
      .findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
        include: {
          media: true,
          components: { include: { brand: true } },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // console.log(posts);
    res.json(posts);
  } else if (req.query.id) {
    const posts = await prisma.fit
      .findMany({
        where: {
          user: {
            instagram: req.query.id,
          },
        },
        include: { media: true, components: { include: { brand: true } } },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // console.log(posts);
    res.json(posts);
  } else {
    const posts = await prisma.fit
      .findMany({
        where: {},
        include: {
          media: true,
          components: { include: { brand: true } },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // console.log(posts);
    res.json(posts);
    // res.send([]);
  }
}
