import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export const FeedByUserId = async (id) => {
  const posts = await prisma.fit
    .findMany({
      where: {
        user: {
          id: Number(id),
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

  return posts;
};

export const FeedBySession = async (session) => {
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
  return posts;
};

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (req.query.id) {
    const posts = await FeedByUserId(req.query.id);
    res.json(posts);
  } else if (session) {
    const posts = await FeedBySession(session);
    res.json(posts);
  }
}
