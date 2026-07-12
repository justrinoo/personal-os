-- CreateEnum
CREATE TYPE "LearningType" AS ENUM ('COURSE', 'BOOK', 'VIDEO', 'ARTICLE', 'CERTIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "LearningStatus" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'FINISHED', 'ABANDONED');

-- AlterTable
ALTER TABLE "daily_activities" ADD COLUMN     "learningItemId" TEXT;

-- CreateTable
CREATE TABLE "learning_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "LearningType" NOT NULL DEFAULT 'COURSE',
    "status" "LearningStatus" NOT NULL DEFAULT 'BACKLOG',
    "sourceUrl" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "notes" TEXT,
    "issuer" TEXT,
    "credentialUrl" TEXT,
    "expiresAt" TIMESTAMP(3),
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "daily_activities" ADD CONSTRAINT "daily_activities_learningItemId_fkey" FOREIGN KEY ("learningItemId") REFERENCES "learning_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

