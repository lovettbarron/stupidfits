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
  const session = await getSession({ req });
  console.log("Create Fit", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

  const media = await prisma.review.update({
    data: {
      user: {
        connect: {
          email: session.user.email,
        },
      },
      published: req.body.published,
      title: req.body.title,
      review: req.body.review,
      slug: req.body.slug,
      item: {
        set: req.body.item.map((i) => ({ id: i.id })),
      },
      tags: {
        set: req.body.tags.map((i) => ({ id: i.id })),
      },
      media: { create: MediaArray },
    },
  });
  res.json(media);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.brand.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
