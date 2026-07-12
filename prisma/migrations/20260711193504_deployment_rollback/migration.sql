-- AlterTable
ALTER TABLE "deployments" ADD COLUMN     "rollbackOfId" TEXT;

-- AddForeignKey
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_rollbackOfId_fkey" FOREIGN KEY ("rollbackOfId") REFERENCES "deployments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

