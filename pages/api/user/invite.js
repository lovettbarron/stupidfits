import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";
import notice from "../../../lib/notif";

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

  const invite = await prisma.invite.update({
    where: {
      id: req.body.id,
    },
    data: {
      seen: true,
      done: true,
    },
    include: {
      group: true,
      collection: true,
      user: true,
    },
  });

  if (invite.group) {
    const group = await prisma.group
      .update({
        where: {
          id: invite.group.id,
        },
        data: {
          member: {
            connect: {
              id: invite.user.id,
            },
          },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    console.log("Added to group", group.id);
    res.json({ path: `/group/${group.id}/${group.slug}` });
  } else if (invite.collection) {
    const collect = await prisma.collection
      .update({
        where: {
          id: invite.collection.id,
        },
        data: {
          member: {
            connect: {
              id: invite.user.id,
            },
          },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    console.log("Added to collection", collect.id);
    res.json({ path: `/collection/${collect.id}/${collect.slug}` });
  } else {
    console.log("Something wrong");
  }
}
