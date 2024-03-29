import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "GET") {
    handleGET(req, res);
  } else if (req.method === "POST") {
    handlePOST(req, res);
  } else if (req.method === "DELETE") {
    handleDELETE(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/get/:id
async function handleGET(req, res) {
  const id = req.query.id;
  console.log(req.query);

  const review = await prisma.battle
    .findOne({
      where: { id: Number(id) },
      include: {
        user: true,
        winners: {
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
            components: {
              include: {
                brand: true,
              },
            },
          },
        },
        collection: {
          include: {
            user: true,
            fits: {
              include: {
                media: true,
              },
            },
          },
        },
        tags: true,
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  res.json(review);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update Fit", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
    include: {
      Battle: true,
    },
  });

  if (!user.Battle.find((c) => Number(c.id) === Number(req.query.id))) {
    console.log("This doesn't belong to you");
    return;
  }
  const battle = await prisma.battle
    .update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        archive: req.body.archive,
      },
      include: {
        collection: true,
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(battle);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.collection.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
