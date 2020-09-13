import fs from "fs";
import path from "§path";
import csv from "fast-csv";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handle(req, res) {
  res.json("Unfinished endpoint");

  const rows = [];
  const batched = [];

  // Import CSV file uploaded in stream
  fs.createReadStream(req.body)
    .pipe(csv.parse({ headers: true }))
    // pipe the parsed input into a csv formatter
    .pipe(csv.format({ headers: true }))
    // Parse into right format for item
    .transform((data) => ({
      brand: data.brand.toLowerCase(),
      name: data.name.toUpperCase(),
      type: data.type.toUpperCase(),
      year: Number(data.year) || null,
      size: data.size.toLowerCase() || null,
      sale: data.sale.toLowerCase() || null,
    }))
    .on("data", (row) => {
      batched.push(
        prisma.item.create({
          user: {
            connect: {
              email: session.user.email,
            },
          },
          brand: {
            connectOrCreate: {
              where: { name: brand },
              create: { name: brand },
            },
          },
          name: row.name,
          type: row.type,
          year: row.year,
          size: row.size,
          sale: row.sale,
        })
      );
    })
    .on("end", () => process.exit());

  // Batching with transaction
  await prisma.batch(batched, { transaction: true });

  res.json(result);
}
