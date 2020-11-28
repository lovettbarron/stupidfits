import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    if (context.res) {
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const collectionCheck = await prisma.collection.findOne({
    where: {
      id: req.body.id,
    },
    include: {
      fits: {
        include: {
          user: true,
        },
      },
    },
  });

  if (collectionCheck.oneperuser) {
    const userCheck = await prisma.fit.findOne({
      where: { id: req.body.fit },
      include: {
        user: true,
      },
    });

    const exist = collectionCheck.fits.find(
      (f) => f.user.id === userCheck.user.id
    );

    if (exist) {
      res.json({});
      res.end();
      return {};
    }
  }

  const review = await prisma.collection
    .update({
      where: {
        id: req.body.id,
      },
      data: {
        fits: {
          connect: { id: req.body.fit },
        },
      },
      include: {
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
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(review);
}
