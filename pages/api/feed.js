import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  // console.log("Session", session);

  if (session) {
    const posts = await prisma.fit.findMany({
      where: {},
      include: { media: true, components: { include: { brand: true } } },
    });
    console.log(posts);
    res.json(posts);
  } else {
    res.send([]);
  }
}
