import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  // console.log("Session", session);

  if (session) {
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
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    });
  }
}

// GET /api/post/:id
async function handleGET(req, res) {
  const id = req.query.id;
  const post = await prisma.media.findOne({
    where: { insta_id: Math.trunc(id) },
  });
  console.log("Returned media", id, post);
  res.json(post);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const id = req.query.id;
  console.log("Saving media", req.body);
  const media = await prisma.fit.create({
    data: {
      media: {
        create: {
          insta_id: Math.trunc(req.body.id),
          username: req.body.username,
          shortcode: req.body.shortCode,
          timestamp: req.body.timestamp,
          image: req.body.imageUrl,
          url: req.body.url,
          description: req.body.caption,
        },
      },
    },
  });
  res.json(media);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const post = await prisma.media.delete({
    where: { id: Number(postId) },
  });
  res.json(post);
}
