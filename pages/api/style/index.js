import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/brand
// Required fields in body: title, authorEmail
// Optional fields in body: content
export default async function handle(req, res) {
  if (req.method === "GET") {
    const styles = await prisma.style.findMany({
      where: {},
      orderBy: { name: "asc" },
    });
    console.log("Returning styles", styles);
    res.json(styles);
  } else if (req.method === "POST") {
    const { name, logo, description } = req.body;
    const result = await prisma.tag.create({
      data: {
        name: title,
        logo: content,
        description: description,
      },
    });
    res.json(result);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}
