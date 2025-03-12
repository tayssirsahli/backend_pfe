/*
  Warnings:

  - The values [planifée,publiée] on the enum `verifier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."verifier_new" AS ENUM ('planifer', 'publier', 'Annuler');
ALTER TABLE "public"."posts" ALTER COLUMN "etat" DROP DEFAULT;
ALTER TABLE "public"."posts" ALTER COLUMN "etat" TYPE "public"."verifier_new" USING ("etat"::text::"public"."verifier_new");
ALTER TYPE "public"."verifier" RENAME TO "verifier_old";
ALTER TYPE "public"."verifier_new" RENAME TO "verifier";
DROP TYPE "public"."verifier_old";
ALTER TABLE "public"."posts" ALTER COLUMN "etat" SET DEFAULT 'planifer';
COMMIT;

-- AlterTable
ALTER TABLE "public"."posts" ALTER COLUMN "etat" SET DEFAULT 'planifer';
