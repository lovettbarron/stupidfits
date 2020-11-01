import { PrismaClient, Status } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
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
  const session = await getSession({ req });

  const post = await prisma.user
    .findOne({
      where: {
        email: session.user.email,
      },
    })
    .fit({ include: { media: true } })
    .finally(async () => {
      await prisma.$disconnect();
    });
  await prisma.$disconnect();
  // console.log("Returned media", id, post, media);
  res.json((post && post.find((p) => p.media[0].insta_id === id)) || false);
}

// POST /api/export/:id
// ID is media id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  const id = req.query.id;
  console.log("Update", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const layers = req.body.layers.map((l) => ({
    where: {
      id: l.id,
    },
    create: {
      x: l.x,
      y: l.y,
      r: l.r,
      item: {
        connect: {
          id: l.item,
        },
      },
    },
  }));

  const media = await prisma.media.update({
    where: {
      id: Number(id),
    },
    data: {
      layers: {
        connectOrCreate: layers,
      },
    },
  });

  res.json(media);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  // const post = await prisma.fit.delete({
  //   where: { id: Number(postId) },
  // });
  res.json(post);
}
