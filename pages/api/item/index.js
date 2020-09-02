import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/item
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  const result = await prisma.item.create({
    data: {
      user: {
        connect: {
          id: req.body.userid,
        },
      },
      fit: {
        connect: {
          id: req.body.fitid,
        },
      },
      ...req.body,
    },
  });
  res.json(result);
}
