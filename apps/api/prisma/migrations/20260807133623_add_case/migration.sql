-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEED_DOCUMENT', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "applicantPartyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "CaseStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_caseNumber_idx" ON "Case"("caseNumber");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_applicantPartyId_fkey" FOREIGN KEY ("applicantPartyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
