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
      id: session.user.id,
    },
  });

  const groupCheck = await prisma.group.findOne({
    where: {
      id: req.body.group,
    },
    include: {
      member: {
        include: {
          user: true,
        },
      },
      Invite: {
        include: {
          user: true,
        },
      },
    },
  });

  // Check if invite and membership exists
  let exist = null;
  exist = groupCheck.member.some((m) => m.id === req.body.user);
  exist = !exist
    ? groupCheck.Invite.some((i) => i.user.id === req.body.user && !i.done)
    : exist;

  if (exist) {
    res.json({});
    res.end();
    return {};
  }

  const group = await prisma.group
    .update({
      where: {
        id: req.body.id,
      },
      data: {
        Invite: {
          create: {
            email: userInvite.email,
            user: {
              connect: {
                id: userInvite.id,
              },
            },
            group: {
              connect: {
                id: req.body.group,
              },
            },
          },
        },
      },
      include: {
        member: true,
        Invite: {
          include: {
            user: true,
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(group);
}
