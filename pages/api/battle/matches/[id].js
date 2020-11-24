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
  // console.log(req.query);

  const matches = await prisma.battleMatchup
    .findMany({
      where: { battle: { id: Number(id) } },
      include: {
        Fits: {
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
        parents: true,
        votes: {
          include: {
            fit: true,
            user: true,
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  // console.log("Found matches", matches);

  res.json(matches);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });

  const id = req.query.id;
  console.log("Vote:", req.query.id, req.body.fit);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const checkVote = await prisma.battleVote.findMany({
    where: {
      user: {
        id: user.id,
      },
      matchup: {
        id: id,
      },
    },
  });
  try {
    if (checkVote.length < 1) {
      console.log("Valid Vote", id);
      const vote = await prisma.battleVote
        .create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
            matchup: {
              connect: {
                id: id,
              },
            },
            fit: {
              connect: {
                id: Number(req.body.fit),
              },
            },
            comment: "",
          },
          include: {
            fit: true,
            user: true,
          },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
      res.json(vote);
    } else {
      console.log("Already Voted on", id);
      await prisma.$disconnect();
      res.json(null);
    }
  } catch (e) {
    console.log("Something went wrong while voting", e);
    await prisma.$disconnect();
    res.status(500).json(null);
  }
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.collection.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
