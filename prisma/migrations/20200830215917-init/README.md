# Migration `20200830215917-init`

This migration has been generated by Andrew Lovett-Barron at 8/30/2020, 11:59:17 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "ItemType" AS ENUM ('BAG', 'SHOE', 'JACKET', 'PANT', 'SHIRT', 'LAYER', 'EXTRA')

CREATE TYPE "Colour" AS ENUM ('aqua', 'azure', 'beige', 'bisque', 'blue', 'brown', 'coral', 'crimson', 'cyan', 'darkred', 'dimgray', 'gold', 'gray', 'green', 'grey', 'hotpink', 'indigo', 'ivory', 'khaki', 'lime', 'linen', 'maroon', 'navy', 'oldlace', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'skyblue', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'violet', 'wheat', 'transparent')

CREATE TYPE "Qual" AS ENUM ('WATERPROOF', 'BREATHABLE')

CREATE TYPE "Platform" AS ENUM ('INSTAGRAM')

CREATE TABLE "public"."User" (
"email" text   NOT NULL ,
"id" SERIAL,
"name" text   ,
"social" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Post" (
"id" SERIAL,
"authorId" integer   ,
"content" text   ,
"published" boolean   NOT NULL DEFAULT false,
"title" text   ,
"socialId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Social" (
"id" SERIAL,
"platform" "Platform"  NOT NULL ,
"platformId" text   NOT NULL ,
"url" text   NOT NULL ,
"image" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Fit" (
"id" SERIAL,
"photo" text   ,
"desc" text   ,
"postId" integer   NOT NULL ,
"itemId" integer   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Closet" (
"id" SERIAL,
"name" text   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Brand" (
"id" SERIAL,
"name" text   NOT NULL ,
"logo" text   ,
"desc" text   ,
PRIMARY KEY ("id")
)

CREATE TABLE "public"."Item" (
"id" SERIAL,
"type" "ItemType"  NOT NULL ,
"photo" text   ,
"model" text   NOT NULL ,
"year" integer   ,
"size" text   ,
"colour" "Colour"[]  ,
"Sale" text   ,
"repair" boolean   ,
"qual" "Qual"  ,
"grailId" integer   ,
"closetId" integer   ,
"fitId" integer   ,
"brandId" integer   NOT NULL ,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "User.social_unique" ON "public"."User"("social")

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("authorId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Post" ADD FOREIGN KEY ("socialId")REFERENCES "public"."Social"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Fit" ADD FOREIGN KEY ("postId")REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Fit" ADD FOREIGN KEY ("itemId")REFERENCES "public"."Item"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("brandId")REFERENCES "public"."Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("grailId")REFERENCES "public"."Closet"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("closetId")REFERENCES "public"."Closet"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("fitId")REFERENCES "public"."Fit"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200830215917-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,143 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model User {
+  email  String  @unique
+  id     Int     @default(autoincrement()) @id
+  name   String?
+  social String  @unique
+  posts  Post[]
+}
+
+model Post {
+  id        Int     @default(autoincrement()) @id
+  author    User?   @relation(fields: [authorId], references: [id])
+  authorId  Int?
+  content   String?
+  published Boolean @default(false)
+  title     String?
+  social    Social
+}
+
+model Social {
+  id         Int      @default(autoincrement()) @id
+  platform   Platform
+  platformId String
+  url        String
+  image      String
+}
+
+model Fit {
+  id         Int     @default(autoincrement()) @id
+  post       Post
+  photo      String?
+  components Item[]  @relation("FitComponent")
+  desc       String?
+  temp       Item?
+}
+
+model Closet {
+  id     Int    @default(autoincrement()) @id
+  name   String
+  grails Item[] @relation("ClosetGrails")
+  items  Item[] @relation("ClosetContent")
+}
+
+model Brand {
+  id   Int     @default(autoincrement()) @id
+  name String
+  logo String?
+  desc String?
+}
+
+model Item {
+  id       Int      @default(autoincrement()) @id
+  type     ItemType
+  photo    String?
+  brand    Brand
+  model    String
+  year     Int?
+  size     String?
+  colour   Colour[]
+  Sale     String?
+  repair   Boolean?
+  qual     Qual?
+  grail    Closet?  @relation("ClosetGrails", fields: [grailId], references: [id])
+  grailId  Int?
+  closet   Closet?  @relation("ClosetContent", fields: [closetId], references: [id])
+  closetId Int?
+  fit      Fit?     @relation("FitComponent", fields: [fitId], references: [id])
+  fitId    Int?
+}
+
+enum ItemType {
+  BAG
+  SHOE
+  JACKET
+  PANT
+  SHIRT
+  LAYER
+  EXTRA
+}
+
+enum Colour {
+  aqua
+  azure
+  beige
+  bisque
+  blue
+  brown
+  coral
+  crimson
+  cyan
+  darkred
+  dimgray
+  gold
+  gray
+  green
+  grey
+  hotpink
+  indigo
+  ivory
+  khaki
+  lime
+  linen
+  maroon
+  navy
+  oldlace
+  olive
+  orange
+  orchid
+  peru
+  pink
+  plum
+  purple
+  red
+  salmon
+  sienna
+  silver
+  skyblue
+  snow
+  tan
+  teal
+  thistle
+  tomato
+  violet
+  wheat
+  transparent
+}
+
+enum Qual {
+  WATERPROOF
+  BREATHABLE
+}
+
+enum Platform {
+  INSTAGRAM
+}
```

