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

// GET /api/user/:id
async function handleGET(res) {
  const post = await prisma.user.findOne({
    where: { email: session.user.email },
  });
  res.json(post);
}

// POST /api/user/:id
async function handlePOST(payload, res) {
  const user = await prisma.post.update({
    where: { email: session.user.email },
    data: { payload },
  });
  res.json(user);
}

// DELETE /api/user/:id
async function handleDELETE(postId, res) {
  const post = await prisma.post.delete({
    where: { id: Number(postId) },
  });
  res.json(post);
}
