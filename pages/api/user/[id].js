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

// GET /api/user/:id
async function handleGET(req, res) {
  const id = req.query.id;
  if (id) {
    console.log("Fetching user on ID", id);
    const post = await prisma.user
      .findOne({
        where: { username: id },
        include: {
          tags: true,
          Review: {
            include: {
              user: true,
              item: {
                include: {
                  brand: true,
                },
              },
              tags: true,
              media: {
                orderBy: {
                  id: "asc",
                },
                include: {
                  layers: true,
                  fit: true,
                },
              },
              Comment: {
                include: {
                  user: true,
                },
              },
            },
          },
          Collection: {
            include: {
              user: true,
              fits: {
                include: {
                  media: true,
                },
              },
              tags: true,
            },
          },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    if (!post) res.status(404);
    res.json(post);
  } else {
    // console.log("Fetching user on session");
    const post = await prisma.user
      .findOne({
        where: { email: session.user.email },
        include: {
          tags: true,
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    if (!post) res.status(404);
    res.json(post);
  }
}

// POST /api/user/:id
async function handlePOST(req, res) {
  return null;
  const user = await prisma.user
    .update({
      where: { email: session.user.email },
      data: { payload },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(user);
}

// DELETE /api/user/:id
async function handleDELETE(req, res) {
  return null;
  const post = await prisma.user.delete({
    where: { id: Number(postId) },
  });
  res.json(post);
}
