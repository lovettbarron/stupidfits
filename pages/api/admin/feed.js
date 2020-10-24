import { PrismaClient, Status } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (session.user.email !== "alb@andrewlb.com") res.status(401).json("");

  if (req.method === "GET") {
    const pending = await prisma.fit.findMany({
      where: {
        status: Status.PENDING,
      },
      include: {
        media: true,
        user: true,
        components: { include: { brand: true } },
      },
    });

    const reported = await prisma.fit.findMany({
      where: {
        status: Status.REPORTED,
      },
      include: {
        media: true,
        user: true,
        components: { include: { brand: true } },
      },
    });

    res.json({ pending, reported });
  } else if (req.method === "POST") {
    const update = await prisma.fit.update({
      where: {
        id: req.query.id,
      },
      data: {
        status: req.body.status,
      },
    });
    res.json(update);
  } else if (req.method === "DELETE") {
    console.log("Nothing there yet");
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
