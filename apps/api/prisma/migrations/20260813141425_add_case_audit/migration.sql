-- CreateEnum
CREATE TYPE "CaseAuditAction" AS ENUM ('CREATED', 'UPDATED', 'SUBMITTED', 'REVIEWED', 'DOCUMENT_REQUESTED', 'RESUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED', 'DOCUMENT_CREATED', 'DOCUMENT_UPDATED', 'DOCUMENT_UPLOADED', 'DOCUMENT_VERIFIED', 'DOCUMENT_REJECTED', 'DOCUMENT_DELETED');

-- CreateTable
CREATE TABLE "CaseAudit" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "action" "CaseAuditAction" NOT NULL,
    "fromStatus" "CaseStatus",
    "toStatus" "CaseStatus",
    "documentId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAudit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaseAudit_caseId_idx" ON "CaseAudit"("caseId");

-- CreateIndex
CREATE INDEX "CaseAudit_action_idx" ON "CaseAudit"("action");

-- CreateIndex
CREATE INDEX "CaseAudit_documentId_idx" ON "CaseAudit"("documentId");

-- CreateIndex
CREATE INDEX "CaseAudit_createdAt_idx" ON "CaseAudit"("createdAt");

-- CreateIndex
CREATE INDEX "Address_partyId_idx" ON "Address"("partyId");

-- CreateIndex
CREATE INDEX "BankAccount_partyId_idx" ON "BankAccount"("partyId");

-- CreateIndex
CREATE INDEX "Case_applicantPartyId_idx" ON "Case"("applicantPartyId");

-- AddForeignKey
ALTER TABLE "CaseAudit" ADD CONSTRAINT "CaseAudit_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAudit" ADD CONSTRAINT "CaseAudit_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "CaseDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
