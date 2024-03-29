import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const id = req.query.id;
  const session = await getSession({ req });

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

// GET /api/post/:id
async function handleGET(req, res) {
  const id = req.query.id;
  let comments = null;

  console.log("Comment body", req.body, req.query.review);
  try {
    comments = await prisma.comment
      .findMany({
        where:
          req.query.review === true
            ? {
                review: {
                  id: Number(id),
                },
              }
            : {
                fit: {
                  id: Number(id),
                },
              },
        include: {
          fit: true,
          user: true,
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  } catch (e) {
    console.log("error:", e.message);
    if (res) {
      res.json(comments || []);
      res.end();
    }
    return {};
  }

  res.json(comments || []);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const id = req.query.id;
  const session = await getSession({ req });
  if (!session) return null;
  if (!req.body.comment) return "No comment found";

  const comment = await prisma.comment
    .create({
      data: {
        user: {
          connect: {
            email: session.user.email,
          },
        },
        fit:
          (!req.body.review && {
            connect: {
              id: Number(id),
            },
          }) ||
          undefined,
        Review:
          (req.body.review && {
            connect: {
              id: Number(id),
            },
          }) ||
          undefined,
        comment: req.body.comment || "",
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  console.log("Created Comment", comment);
  res.json(comment);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.fit.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
