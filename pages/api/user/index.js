import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });
  try {
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
  } catch (e) {
    console.log("Error /user", e);
  }
}

// GET /api/user/:id
async function handleGET(req, res) {
  const session = await getSession({ req });
  if (!session || (session && !session.user)) {
    res.status(400).json(null);
  } else {
    const user = await prisma.user
      .findOne({
        where: { email: session.user.email },
        include: {
          tags: true,
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    // console.log("Fetched user", user);
    res.json(user);
  }
}

// POST /api/user/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update", session.user.email, req.body);
  if (!session) return;

  console.log(req.body);

  const genderids =
    Array.isArray(req.body.gender) &&
    req.body.gender.map((g) => String(g.id).toUpperCase());

  const styles =
    (req.body.tags &&
      req.body.tags.map((c) => ({
        id: c.id,
      }))) ||
    null;

  const user = await prisma.user
    .update({
      where: { email: session.user.email },
      data: {
        // instagram: req.body.instagram,
        username: req.body.username,
        public: req.body.public,
        profilepage: req.body.profilepage,
        description: req.body.description,
        url: req.body.url,
        urllabel: req.body.urllabel,
        hideface: req.body.hideface,
        hidecloset: req.body.hidecloset,
        style: req.body.style,
        gender: {
          set: genderids,
        },
        top: {
          set: req.body.top.map((t) => t.id),
        },
        bottom: {
          set: req.body.bottom.map((t) => t.id),
        },
        tags: {
          set: styles,
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
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
