import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";
const prisma = new PrismaClient();

export const notif = async (user, text, link) => {
  try {
    const notif = await prisma.notification
      .create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          content: text,
          cta: link,
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
    return notif;
  } catch (e) {
    console.log("Notification error");
    return null;
  }
};
