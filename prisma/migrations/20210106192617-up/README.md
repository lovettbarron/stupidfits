# Migration `20210106192617-up`

This migration has been generated by Andrew Lovett-Barron at 1/6/2021, 8:26:17 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "Brand" ADD COLUMN     "display" TEXT
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201202180734-up..20210106192617-up
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -9,9 +9,9 @@
 }
 // datasource db {
 //   provider = "postgresql"
-//   url = "***"
+//   url = "***"
 // }
 model Account {
   id                 Int       @id @default(autoincrement())
@@ -153,8 +153,9 @@
 model Brand {
   id    Int     @id @default(autoincrement())
   name  String  @unique
+  display String?
   logo  String?
   desc  String?
   Item  Item[]
   style Style[]
```


