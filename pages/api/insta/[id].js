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

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update", session.user.email, req.body);

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

  const d = new Date(Date.parse(req.body.timestamp));

  let MediaArray = [];
  if (!req.body.children) {
    const uploadpath = req.body.media_url;
    const cloudurl = await cloudinary.uploader.upload(uploadpath, {
      public_id: `stupidfits/instagram/${req.body.id}`,
    });
    MediaArray.push({
      insta_id: req.body.id,
      username: req.body.username,
      timestamp: Math.floor(d.getTime() / 1000),
      cloudinary: (cloudurl && cloudurl.public_id) || null,
      image: req.body.media_url,
      url: req.body.permalink,
      description: req.body.caption || "",
    });
  } else {
    for (let c of req.body.children) {
      const uploadpath = c.media_url;
      const cloudurl = await cloudinary.uploader
        .upload(uploadpath, {
          public_id: `stupidfits/instagram/${c.id}`,
        })
        .catch((e) => console.log("Error uploading", e));

      let hideface = null;
      if (user.hideFace) {
        hideface = await cloudinary.uploader
          .upload(uploadpath, {
            public_id: `stupidfits/instagram/${c.id}`,
          })
          .catch((e) => console.log("Error uploading", e));
      }

      MediaArray.push({
        insta_id: c.id,
        username: req.body.username,
        timestamp: Math.floor(d.getTime() / 1000),
        cloudinary: cloudurl.public_id,
        image: c.media_url,
        url: c.permalink,
        censor: hideface,
        description: req.body.caption || "",
      });
    }
  }

  console.log("Making with media", MediaArray);

  // Set path

  const media = await prisma.fit.create({
    data: {
      user: {
        connect: {
          email: session.user.email,
        },
      },
      status: user.defaultStatus,
      media: { create: MediaArray },
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
