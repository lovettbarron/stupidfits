# Migration `20201116190509-up`

This migration has been generated by Andrew Lovett-Barron at 11/16/2020, 8:05:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Comment" ALTER COLUMN "fitId" DROP NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201111210507-up..20201116190509-up
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Account {
   id                 Int       @id @default(autoincrement())
@@ -173,11 +173,11 @@
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now()) @map(name: "created_at")
   updatedAt DateTime @default(now()) @map(name: "updated_at")
   user      User     @relation(fields: [userId], references: [id])
-  fit       Fit      @relation(fields: [fitId], references: [id])
+  fit       Fit?     @relation(fields: [fitId], references: [id])
   userId    Int
-  fitId     Int
+  fitId     Int?
   comment   String
   Review    Review?  @relation(fields: [reviewId], references: [id])
   reviewId  Int?
 }
```

