import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const postId = req.query.id;
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

// GET /api/user/:id
async function handleGET(req, res) {
  const id = req.query.id;
  if (id) {
    console.log("Fetching user on ID", id);
    const post = await prisma.user.findOne({
      where: { username: id },
    });
    res.json(post);
  } else {
    console.log("Fetching user on session");
    const post = await prisma.user.findOne({
      where: { email: session.user.email },
    });
    res.json(post);
  }
}

// POST /api/user/:id
async function handlePOST(req, res) {
  return null;
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { payload },
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
