import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/brand
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany({
      where: { public: true },
      orderBy: { name: "asc" },
    });
    console.log("Returning users", users);
    res.json(users);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
