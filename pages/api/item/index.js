import { PrismaClient } from "@prisma/client";
import { getSession, session } from "next-auth/client";

const prisma = new PrismaClient();

// POST /api/item
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  const session = await getSession({ req });
  console.log("item create Session", session);
  console.log("item req body", req.body);

  const brand = req.body.brand.map((b) => ({
    where: { name: (b.id || "").toLowerCase() },
    create: { name: (b.id || "").toLowerCase() },
  }));

  console.log("brands", brand);
  const result = await prisma.item.create({
    data: {
      user: {
        connect: {
          email: session.user.email,
        },
      },
      fit: req.body.fitid && {
        connect: {
          id: req.body.fitid,
        },
      },
      model: req.body.model,
      year: Number(req.body.year),
      brand: {
        connectOrCreate: brand.length < 2 ? brand[0] : brand,
      },
      type: req.body.type[0].id,
    },
  });
  res.json(result);
}
