/*
  Warnings:

  - The `cvLocales` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cvLocales",
ADD COLUMN     "cvLocales" JSONB NOT NULL DEFAULT '[]';
