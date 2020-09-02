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

// GET /api/item/:id
async function handleGET(req, res) {
  const id = req.query.id;
  const fit = await prisma.item.findOne({
    where: { id: Number(id) },
  });
  res.json(fit);
}

// POST /api/item/:id
async function handlePOST(req, res) {
  const id = req.query.id;
  const fit = await prisma.item.update({
    where: { id: Number(id) },
    data: { req.body },
  });
  res.json(fit);
}

// DELETE /api/item/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.item.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
