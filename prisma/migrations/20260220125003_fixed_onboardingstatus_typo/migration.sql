/*
  Warnings:

  - You are about to drop the column `onbaordingStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onbaordingStatus",
ADD COLUMN     "onboardingStatus" "OnBoardingStatus" NOT NULL DEFAULT 'PENDING';
