import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Case Workflow E2E', () => {
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

  it('creates a PERSON party', async () => {
    const response = await request(app.getHttpServer())
      .post('/party')
      .send({
        partyType: 'PERSON',
        displayName: 'E2E Test Applicant',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();

    partyId = response.body.id;
  });

  it('activates the party as applicant', async () => {
    const response = await request(app.getHttpServer())
      .post(`/applicants/${partyId}/activate`)
      .expect(201);

    expect(response.body).toBeDefined();
  });

  it('creates a case', async () => {
    const response = await request(app.getHttpServer())
      .post('/cases')
      .send({
        applicantPartyId: partyId,
        title: 'E2E Case Workflow Test',
        description: 'Automated end-to-end workflow test',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();

    caseId = response.body.id;

    expect(response.body.status).toBe('DRAFT');
  });

  it('submits the case', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/submit`)
      .expect(201);

    expect(response.body.status).toBe('SUBMITTED');
  });

  it('starts review', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/review`)
      .expect(201);

    expect(response.body.status).toBe('UNDER_REVIEW');
  });

  it('requests documents', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/request-documents`)
      .expect(201);

    expect(response.body.status).toBe('NEED_DOCUMENT');
  });

  it('creates a required national-card document', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/documents`)
      .send({
        type: 'NATIONAL_CARD',
        title: 'National Card',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();

    documentId = response.body.id;

    expect(response.body.status).toBe('REQUIRED');
  });

  it('uploads the document', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/upload`,
      )
      .send({
        filePath:
          'e2e-test/national-card-test.pdf',
      })
      .expect(201);

    expect(response.body.status).toBe('UPLOADED');
    expect(response.body.filePath).toBe(
      'e2e-test/national-card-test.pdf',
    );
  });

  it('verifies the document', async () => {
    const response = await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/verify`,
      )
      .expect(201);

    expect(response.body.status).toBe('VERIFIED');
    expect(response.body.verifiedAt).toBeDefined();
  });

  it('resubmits the case for review', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/resubmit`)
      .expect(201);

    expect(response.body.status).toBe('UNDER_REVIEW');
  });

  it('approves the case after all documents are verified', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/approve`)
      .expect(201);

    expect(response.body.status).toBe('APPROVED');
  });

  it('completes the case', async () => {
    const response = await request(app.getHttpServer())
      .post(`/cases/${caseId}/complete`)
      .expect(201);

    expect(response.body.status).toBe('COMPLETED');
  });

  it('returns the completed case', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cases/${caseId}`)
      .expect(200);

    expect(response.body.id).toBe(caseId);
    expect(response.body.status).toBe('COMPLETED');

    expect(response.body.caseDocuments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: documentId,
          type: 'NATIONAL_CARD',
          status: 'VERIFIED',
        }),
      ]),
    );
  });
});