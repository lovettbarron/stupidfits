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
  // console.log(req.query);

  const group = await prisma.group.findOne({
    where: { id: Number(id) },
    include: {
      brands: true,
      tags: true,
      Invite: {
        include: {
          user: true,
        },
      },
      user: {
        include: {
          fit: {
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
        },
      },
      collection: {
        include: {
          user: true,
          tags: true,
          fits: {
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
        },
      },
      member: {
        include: {
          fit: {
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
        },
      },
    },
  });

  res.json(group);
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });
  console.log("Update Group", session.user.email, req.query.id, req.body);

  const user = await prisma.user.findOne({
    where: {
      id: session.user.id,
    },
    include: {
      GroupAdmin: true,
    },
  });

  if (!user.GroupAdmin.some((c) => Number(c.id) === Number(req.query.id))) {
    console.log("This doesn't belong to you");
    return;
  }

  const group = await prisma.group
    .update({
      where: {
        id: Number(req.query.id),
      },
      data: {
        public: req.body.public,
        inviteonly: req.body.inviteonly,
        name: req.body.name,
        description: req.body.description,
        slug: req.body.slug
          .toLowerCase()
          .split(" ")
          .join("-")
          .replace(/[^\w\s-_]/gi, ""),
        brands: {
          set: req.body.brands.map((i) => ({ id: i.id })),
        },
        tags: {
          set: req.body.tags.map((i) => ({ id: i.id })),
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(group);
}

// DELETE /api/post/:id
async function handleDELETE(req, res) {
  const id = req.query.id;
  const post = await prisma.collection.delete({
    where: { id: Number(id) },
  });
  res.json(post);
}
