import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Case Approval Gate E2E', () => {
  let app: INestApplication;

  let partyId: string;
  let caseId: string;
  let documentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates and activates an applicant', async () => {
    const partyResponse = await request(app.getHttpServer())
      .post('/party')
      .send({
        partyType: 'PERSON',
        displayName: 'Approval Gate E2E Applicant',
      })
      .expect(201);

    partyId = partyResponse.body.id;

    expect(partyId).toBeDefined();

    await request(app.getHttpServer())
      .post(`/applicants/${partyId}/activate`)
      .expect(201);
  });

  it('creates the case', async () => {
    const response = await request(app.getHttpServer())
      .post('/cases')
      .send({
        applicantPartyId: partyId,
        title: 'Approval Gate E2E Test',
        description: 'Verify approval is blocked by unverified documents',
      })
      .expect(201);

    caseId = response.body.id;

    expect(response.body.status).toBe('DRAFT');
  });

  it('submits and starts review', async () => {
    await request(app.getHttpServer())
      .post(`/cases/${caseId}/submit`)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/review`)
      .expect(201);

    expect(response.body.status).toBe('UNDER_REVIEW');
  });

  it('creates a required document', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/documents`)
      .send({
        type: 'NATIONAL_CARD',
        title: 'National Card',
      })
      .expect(201);

    documentId = response.body.id;

    expect(response.body.status).toBe('REQUIRED');
  });

  it('blocks approval while the document is not verified', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/approve`)
      .expect(400);

    expect(response.body.message).toContain(
      'All documents must be VERIFIED',
    );
  });

  it('keeps the case in UNDER_REVIEW after blocked approval', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cases/${caseId}`)
      .expect(200);

    expect(response.body.status).toBe('UNDER_REVIEW');
  });

  it('creates the APPROVAL_BLOCKED audit entry', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cases/${caseId}/audit`)
      .expect(200);

    const blockedEntries = response.body.filter(
      (entry: any) =>
        entry.action === 'APPROVAL_BLOCKED',
    );

    expect(blockedEntries.length).toBeGreaterThan(0);

    const latestBlocked = blockedEntries[blockedEntries.length - 1];

    expect(latestBlocked.fromStatus).toBe(
      'UNDER_REVIEW',
    );

    expect(latestBlocked.toStatus).toBe(
      'UNDER_REVIEW',
    );

    expect(latestBlocked.metadata.reason).toBe(
      'UNVERIFIED_DOCUMENTS',
    );

    expect(
      latestBlocked.metadata.unverifiedDocumentCount,
    ).toBe(1);

    expect(
      latestBlocked.metadata.unverifiedDocuments[0]
        .documentId,
    ).toBe(documentId);
  });
});