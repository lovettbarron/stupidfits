import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  console.log("Fetching global feed");
  const posts = await prisma.fit
    .findMany({
      where: {
        user: {
          public: true,
        },
      },
      include: {
        media: {
          include: {
            layers: {
              include: {
                item: {
                  include: { brand: true },
                },
                media: true,
              },
            },
          },
        },
        user: true,
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
