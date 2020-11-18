import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
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
  console.log(req.query);

  const review = await prisma.collection.findOne({
    where: { id: Number(id) },
    include: {
      user: true,
      fits: {
        where: {
          user: {
            public: true,
          },
        },
        include: {
          media: {
            include: {
              layers: {
                include: {
                  item: {
                    include: { brand: true },
                  },
                  media: true,
                },
              },
            },
          },
          user: true,
          components: {
            include: {
              brand: true,
            },
          },
        },
      },
      tags: true,
      Comment: {
        orderBy: {
          id: "asc",
        },
        include: {
          user: true,
        },
      },
    },
  });

  res.json(review);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update Fit", session.user.email, req.body);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
    include: {
      Collection: true,
    },
  });

  if (!user.Collection.find((c) => Number(c.id) === Number(req.query.id))) {
    console.log("This doesn't belong to you");
    return;
  }
  const collection = await prisma.collection.update({
    where: {
      id: Number(req.query.id),
    },
    data: {
      published: req.body.published,
      title: req.body.title,
      description: req.body.description,
      slug: req.body.slug
        .toLowerCase()
        .split(" ")
        .join("-")
        .replace(/[^\w\s-_]/gi, ""),
      tags: {
        set: req.body.tags.map((i) => ({ id: i.id })),
      },
    },
  });
  res.json(collection);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.collection.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
