import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

// POST /api/brand
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === "GET") {
    const session = await getSession({ req });
    const review = await prisma.collection.findMany({
      where: {
        OR: [
          {
            public: true,
          },
          {
            user: {
              id: session.user.id,
            },
          },
        ],
      },
      include: {
        user: true,
        fits: {
          include: {
            media: true,
          },
        },
        tags: true,
        Comment: {
          include: {
            user: true,
          },
        },
      },
    });

    res.json(review);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
