import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  if (!session && session.user.email) res.json(null);
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
  const session = await getSession({ req });
  console.log("/user Session", session);
  const user = await prisma.user.findOne({
    where: { email: session.user.email },
  });
  // console.log("Fetched user", user);
  res.json(user);
}

// POST /api/user/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  // console.log("Update", req.query.user, req.body);
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      instagram: req.body.instagram,
      username: req.body.username,
    },
  });
  res.json(user);
}

// DELETE /api/user/:id
async function handleDELETE(req, res) {
  const session = await getSession({ req });
  // const post = await prisma.post.delete({
  //   where: { id: Number(postId) },
  // });
  res.json(null);
}