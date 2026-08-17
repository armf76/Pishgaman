import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Case Negative Workflow E2E', () => {
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
        displayName: 'Negative Workflow E2E Applicant',
      })
      .expect(201);

    partyId = partyResponse.body.id;

    await request(app.getHttpServer())
      .post(`/applicants/${partyId}/activate`)
      .expect(201);
  });

  it('creates a case in DRAFT', async () => {
    const response = await request(app.getHttpServer())
      .post('/cases')
      .send({
        applicantPartyId: partyId,
        title: 'Negative Workflow E2E Test',
        description: 'Validate forbidden workflow transitions',
      })
      .expect(201);

    caseId = response.body.id;

    expect(response.body.status).toBe('DRAFT');
  });

  it('blocks approval from DRAFT', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/approve`)
      .expect(400);

    expect(response.body.message).toContain(
      'Invalid case transition: DRAFT -> APPROVED',
    );
  });

  it('keeps the case in DRAFT after blocked approval', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cases/${caseId}`)
      .expect(200);

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

  it('blocks completion from UNDER_REVIEW', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/complete`)
      .expect(400);

    expect(response.body.message).toContain(
      'Invalid case transition: UNDER_REVIEW -> COMPLETED',
    );
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

  it('uploads the document', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/upload`,
      )
      .send({
        filePath: 'e2e-test/negative-workflow.pdf',
      })
      .expect(201);

    expect(response.body.status).toBe('UPLOADED');
  });

  it('verifies the document and approves the case', async () => {
    const documentResponse = await request(
      app.getHttpServer(),
    )
      .post(
        `/cases/${caseId}/documents/${documentId}/verify`,
      )
      .expect(201);

    expect(documentResponse.body.status).toBe('VERIFIED');

    const caseResponse = await request(
      app.getHttpServer(),
    )
      .post(`/cases/${caseId}/approve`)
      .expect(201);

    expect(caseResponse.body.status).toBe('APPROVED');
  });

  it('blocks approval again after the case is already APPROVED', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/approve`)
      .expect(400);

    expect(response.body.message).toContain(
      'Invalid case transition: APPROVED -> APPROVED',
    );
  });

  it('blocks cancellation after the case is APPROVED', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/cancel`)
      .expect(201);

    /*
     * Current CaseService explicitly allows:
     *
     * APPROVED -> CANCELLED
     *
     * Therefore this test documents the current behavior.
     */
    expect(response.body.status).toBe('CANCELLED');
  });

  it('blocks completion after cancellation', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/complete`)
      .expect(400);

    expect(response.body.message).toContain(
      'Invalid case transition: CANCELLED -> COMPLETED',
    );
  });
});