import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  if (req.method === "POST") {
    handlePOST(req, res);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

// POST /api/post/:id
async function handlePOST(req, res) {
  const session = await getSession({ req });

  const id = req.query.id;
  console.log(req.query);

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  });

  const vote = await prisma.battleVote
    .create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        matchup: {
          connect: {
            id: id,
          },
        },
        fit: {
          connect: {
            id: Number(req.body.fit),
          },
        },
        comment: "",
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  res.json(vote);
}
