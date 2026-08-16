-- CreateEnum
CREATE TYPE "CaseDocumentStatus" AS ENUM ('REQUIRED', 'UPLOADED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CaseDocumentType" AS ENUM ('NATIONAL_CARD', 'BIRTH_CERTIFICATE', 'PASSPORT', 'OWNERSHIP_DOCUMENT', 'POWER_OF_ATTORNEY', 'COMPANY_DOCUMENT', 'OTHER');

-- CreateTable
CREATE TABLE "CaseDocument" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "CaseDocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "status" "CaseDocumentStatus" NOT NULL DEFAULT 'REQUIRED',
    "filePath" TEXT,
    "rejectionReason" TEXT,
    "uploadedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseDocument_caseId_idx" ON "CaseDocument"("caseId");

-- CreateIndex
CREATE INDEX "CaseDocument_status_idx" ON "CaseDocument"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CaseDocument_caseId_type_key" ON "CaseDocument"("caseId", "type");

-- AddForeignKey
ALTER TABLE "CaseDocument" ADD CONSTRAINT "CaseDocument_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
