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
  const media = await prisma.media
    .findOne({
      where: { id: Number(id) },
      include: {
        layers: {
          include: {
            item: {
              include: { brand: true },
            },
            media: true,
          },
        },
        fit: true,
        user: true,
        components: { include: { brand: true } },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(media);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const id = req.body.id;
  const item = req.body.item;
  const fit = req.body.fit;

  if (!req.body.imgs || req.body.imgs.length < 1) {
    res.status(400).json({ error: "No media refs" });
    return null;
  }

  const session = await getSession({ req });
  console.log("Create Fit", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const d = new Date();

  let MediaArray = [];

  for (let c of req.body.imgs) {
    MediaArray.push({
      insta_id: null,
      username: user.username,
      timestamp: Math.floor(d.getTime() / 1000),
      cloudinary: c,
      image: null,
      url: null,
      description: "",
    });
  }

  const media = await prisma.media
    .update({
      where: { id: Number(id) },
      data: {},
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

  // console.log("Updated fit", fit);
  res.json(media);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.fit.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
export const config = {
  api: {
    externalResolver: true,
  },
};
