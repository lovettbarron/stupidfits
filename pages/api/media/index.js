import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/fit
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  res.json("Unfinished endpoint");
  const { title, content, authorEmail } = req.body;
  const result = await prisma.item.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
}
