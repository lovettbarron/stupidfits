import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

// POST /api/item
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  const session = await getSession({ req });
  // console.log("item Session", session);
  console.log("item req query", req.query);

  ///
  /// FETCH ITEMS
  //

  if (req.method === "GET") {
    const id = req.query.id;
    let posts;
    if (id) {
      posts = await prisma.item
        .findMany({
          where: { user: { id: Number(id) } },
          include: { brand: true },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
      res.json(posts);
    } else if (session && session.user.email) {
      posts = await prisma.item
        .findMany({
          where: { user: { email: session.user.email } },
          include: { brand: true },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
      res.json(posts);
    } else {
      res.json([]);
    }
    // console.log(posts);
  } else if (req.method === "POST") {
    //
    // CREATE NEW ITEM
    //

    const brand = req.body.brand.map((b) => ({
      where: { name: (b.label || "").toLowerCase() },
      create: { name: (b.label || "").toLowerCase() },
    }));

    const brandChecker = req.body.brand.map((b) => ({
      where: { name: (b.label || "").toLowerCase() },
    }));

    // Check if this combo exists
    const exists = await prisma.item
      .findMany({
        where: {
          user: {
            email: session.user.email,
          },
        },
      })
      .finally(async () => {
        await prisma.$disconnect();
      });

    // TODO add brand filter
    const filtered = exists.filter(
      (e) =>
        e.model == req.body.model &&
        e.year == Number(req.body.year) &&
        e.type == req.body.type
    );
    // console.log("f", filtered);

    // If it exists, just return the result
    if (filtered && filtered.length > 0) res.json(exists);
    else {
      console.log("Making new item");
      const result = await prisma.item
        .create({
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
            type: req.body.type,
          },
        })
        .finally(async () => {
          await prisma.$disconnect();
        });
      res.json(result);
    }
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
