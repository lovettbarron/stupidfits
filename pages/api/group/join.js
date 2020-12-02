import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
import * as cloudinary from "cloudinary";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    if (context.res) {
      console.log("Nope");
      context.res.writeHead(302, { Location: `/` });
      context.res.end();
    }
    return {};
  }

  console.log("Joining group", req.body);
  const group = await prisma.group
    .update({
      where: {
        id: Number(req.body.id),
      },
      data: {
        member: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  console.log("Connected", session.user.id, req.body.id);
  res.json(group);
}
