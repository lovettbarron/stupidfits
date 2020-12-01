import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";
import { notif } from "../../../lib/notif";

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

  console.log(req.body);

  const user = await prisma.user.findOne({
    where: {
      id: session.user.id,
    },
  });

  const userInvite = await prisma.user.findOne({
    where: {
      id: req.body.user,
    },
  });

  const groupCheck = await prisma.group.findOne({
    where: {
      id: Number(req.body.group),
    },
    include: {
      user: true,
      member: true,
      Invite: {
        include: {
          user: true,
        },
      },
    },
  });

  if (
    !groupCheck.member.some((m) => m.id === user.id) &&
    groupCheck.user.id !== user.id
  ) {
    console.log("This user isn't a member of the group");
    res.json({});
    res.end();
    return {};
  }

  // Check if invite and membership exists
  let exist = null;
  exist = groupCheck.member.some((m) => m.id === req.body.user);
  exist = !exist
    ? groupCheck.Invite.some((i) => i.user.id === req.body.user && !i.done)
    : exist;

  if (exist) {
    console.log("Member already invited to or part of this group");
    res.json({});
    res.end();
    return {};
  }

  const group = await prisma.group
    .update({
      where: {
        id: groupCheck.id,
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
  notif(
    userInvite,
    `You've been invited to ${group.name}`,
    `/group/${group.id}/${group.slug}`
  );
  res.json(group);
}
