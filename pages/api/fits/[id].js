import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const postId = req.query.id;
  const session = await getSession({ req });

  if (req.method === "GET") {
    handleGET();
  } else if (req.method === "POST") {
    handlePOST();
  } else if (req.method === "DELETE") {
    handleDELETE();
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// GET /api/post/:id
async function handleGET(postId, res) {
  const post = await prisma.post.findOne({
    where: { id: Number(postId) },
    include: { author: true },
  });
  res.json(post);
}

// POST /api/post/:id
async function handlePOST(payload, res) {
  const user = await prisma.post.update({
    where: { email: session.user.email },
    data: { payload },
  });
  res.json(user);
}

// DELETE /api/post/:id
async function handleDELETE(postId, res) {
  const post = await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.json(post);
}
