import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
// import cloudinary from "cloudinary";

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
    .fit({ include: { media: true } });
  await prisma.$disconnect();
  // console.log("Returned media", id, post, media);
  res.json((post && post.find((p) => p.media.insta_id === id)) || false);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update", session.user.email, req.body);

  // TODO Upload image to cloudinary
  // https://res.cloudinary.com/<your Cloudinary account's cloud name>/<resource_type>/upload/<mapped upload folder prefix>/<partial path of remote resource>

  const uploadpath = req.body.media_url;
  // const image = await fetch(`https://res.cloudinary.com/${process.env.CLOUDINARY_ACCOUNT}/image/upload/stupidfits/${uploadpath}`, {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(body),
  // });

  // cloudinary.imageTag(uploadpath, {type: "fetch"}).toHtml();

  const d = new Date(Date.parse(req.body.timestamp));
  // Set path
  const media = await prisma.fit.create({
    data: {
      user: {
        connect: {
          email: session.user.email,
        },
      },
      media: {
        create: {
          insta_id: req.body.id,
          username: req.body.username,
          timestamp: Math.floor(d.getTime() / 1000),
          image: req.body.media_url,
          url: req.body.permalink,
          description: req.body.caption || "",
        },
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
