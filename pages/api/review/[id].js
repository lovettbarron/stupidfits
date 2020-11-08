import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

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

// GET /api/get/:id
async function handleGET(req, res) {
  const id = req.query.id;

  const review = await prisma.review.findOne({
    where: { name: id },
    include: {
      user: true,
      item: {
        brand: true,
      },
      tags: true,
      media: {
        layers: true,
        fit: true,
      },
      Comment: {
        user: true,
      },
    },
  });

  res.json(review);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const id = req.query.id;
  const session = await getSession({ req });
  if (!session) return res.status(402);
  const fit = await prisma.brand.update({
    where: { id: Number(id) },
    data: { payload },
  });
  res.json(fit);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.brand.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}