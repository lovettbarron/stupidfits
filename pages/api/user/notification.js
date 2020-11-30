import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";
const prisma = new PrismaClient();

// POST /api/brand
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === "GET") {
    const session = await getSession({ req });
    if (!session || (session && !session.user)) {
      res.status(400).json(null);
    }

    const notif = await prisma.notification.findMany({
      where: {
        user: {
          id: session.user.id,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const invite = await prisma.invite.findMany({
      where: {
        user: {
          id: session.user.id,
        },
        done: false,
      },
      orderBy: { id: "desc" },
      include: {
        collection: true,
        group: true,
      },
    });

    res.json({ notification: notif, invite: invite });
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
