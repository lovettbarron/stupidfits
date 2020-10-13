# Migration `20201010111310-up`

This migration has been generated by Andrew Lovett-Barron at 10/10/2020, 1:13:10 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."users" ADD COLUMN "instagramrefresh" timestamp(3)   ,
ADD COLUMN "public" boolean   NOT NULL DEFAULT true,
ADD COLUMN "profilepage" boolean   NOT NULL DEFAULT true
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200913214340-up..20201010111310-up
--- datamodel.dml
+++ datamodel.dml
@@ -4,13 +4,13 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Account {
-  id                 Int       @default(autoincrement()) @id
+  id                 Int       @id @default(autoincrement())
   compoundId         String    @unique @map(name: "compound_id")
   userId             Int       @map(name: "user_id")
   providerType       String    @map(name: "provider_type")
   providerId         String    @map(name: "provider_id")
@@ -20,17 +20,17 @@
   accessTokenExpires DateTime? @map(name: "access_token_expires")
   createdAt          DateTime  @default(now()) @map(name: "created_at")
   updatedAt          DateTime  @default(now()) @map(name: "updated_at")
+
   @@index([providerAccountId], name: "providerAccountId")
   @@index([providerId], name: "providerId")
   @@index([userId], name: "userId")
-
   @@map(name: "accounts")
 }
 model Session {
-  id           Int      @default(autoincrement()) @id
+  id           Int      @id @default(autoincrement())
   userId       Int      @map(name: "user_id")
   expires      DateTime
   sessionToken String   @unique @map(name: "session_token")
   accessToken  String   @unique @map(name: "access_token")
@@ -40,27 +40,31 @@
   @@map(name: "sessions")
 }
 model User {
-  id            Int       @default(autoincrement()) @id
-  name          String?
-  email         String?   @unique
-  emailVerified DateTime? @map(name: "email_verified")
-  image         String?
-  createdAt     DateTime  @default(now()) @map(name: "created_at")
-  updatedAt     DateTime  @default(now()) @map(name: "updated_at")
-  username      String?   @unique
-  fit           Fit[]     @relation("FitRelation")
-  item          Item[]    @relation("ItemRelation")
-  closet        Closet[]  @relation("ClosetRelation")
-  instagram     String?   @unique
-  instagramlong String?
+  id               Int       @id @default(autoincrement())
+  name             String?
+  email            String?   @unique
+  emailVerified    DateTime? @map(name: "email_verified")
+  image            String?
+  createdAt        DateTime  @default(now()) @map(name: "created_at")
+  updatedAt        DateTime  @default(now()) @map(name: "updated_at")
+  username         String?   @unique
+  fit              Fit[]     @relation("FitRelation")
+  item             Item[]    @relation("ItemRelation")
+  closet           Closet[]  @relation("ClosetRelation")
+  instagram        String?   @unique
+  instagramlong    String?
+  instagramrefresh DateTime?
+  public           Boolean   @default(true)
+  profilepage      Boolean   @default(true)
+
   @@map(name: "users")
 }
 model VerificationRequest {
-  id         Int      @default(autoincrement()) @id
+  id         Int      @id @default(autoincrement())
   identifier String
   token      String   @unique
   expires    DateTime
   createdAt  DateTime @default(now()) @map(name: "created_at")
@@ -69,9 +73,9 @@
   @@map(name: "verification_requests")
 }
 model Media {
-  id          Int     @default(autoincrement()) @id
+  id          Int     @id @default(autoincrement())
   insta_id    String  @unique
   username    String?
   shortcode   String  @unique
   timestamp   Int
@@ -82,9 +86,9 @@
   fitId       Int?
 }
 model Fit {
-  id         Int     @default(autoincrement()) @id
+  id         Int     @id @default(autoincrement())
   media      Media   @relation("MediaRelationship")
   components Item[]  @relation("FitComponent")
   desc       String?
   temp       String?
@@ -92,26 +96,26 @@
   userId     Int?
 }
 model Closet {
-  id     Int    @default(autoincrement()) @id
+  id     Int    @id @default(autoincrement())
   name   String
   grails Item[] @relation("ClosetGrails")
   items  Item[] @relation("ClosetContent")
   user   User?  @relation("ClosetRelation", fields: [userId], references: [id])
   userId Int?
 }
 model Brand {
-  id   Int     @default(autoincrement()) @id
+  id   Int     @id @default(autoincrement())
   name String  @unique
   logo String?
   desc String?
   Item Item[]
 }
 model Item {
-  id       Int      @default(autoincrement()) @id
+  id       Int      @id @default(autoincrement())
   type     ItemType
   photo    String?
   brand    Brand    @relation(fields: [brandId], references: [id])
   model    String
```

