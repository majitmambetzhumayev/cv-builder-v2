-- CreateEnum
CREATE TYPE "OnBoardingStatus" AS ENUM ('PENDING', 'USERNAME_SET', 'COMPLETE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onbaordingStatus" "OnBoardingStatus" NOT NULL DEFAULT 'PENDING';
