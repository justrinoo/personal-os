-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "clickupListId" TEXT,
ADD COLUMN     "clickupListName" TEXT,
ADD COLUMN     "clickupSyncedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "clickupRemoteUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "clickupUrl" TEXT;

-- CreateTable
CREATE TABLE "clickup_status_map" (
    "id" TEXT NOT NULL,
    "remoteStatus" TEXT NOT NULL,
    "localStatus" "TaskStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clickup_status_map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clickup_status_map_remoteStatus_key" ON "clickup_status_map"("remoteStatus");

-- CreateIndex
CREATE UNIQUE INDEX "projects_clickupListId_key" ON "projects"("clickupListId");

