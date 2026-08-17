import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Case Document Tampering E2E', () => {
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

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a PERSON party', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/party')
      .send({
        partyType: 'PERSON',
        displayName:
          'Document Tampering Test Applicant',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();

    partyId = response.body.id;
  });

  it('activates the party as applicant', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(`/applicants/${partyId}/activate`)
      .expect(201);

    expect(response.body).toBeDefined();
  });

  it('creates a case', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post('/cases')
      .send({
        applicantPartyId: partyId,
        title: 'Document Tampering Test Case',
        description:
          'Verify document workflow protection',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('DRAFT');

    caseId = response.body.id;
  });

  it('submits the case', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(`/cases/${caseId}/submit`)
      .expect(201);

    expect(response.body.status).toBe('SUBMITTED');
  });

  it('starts review', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(`/cases/${caseId}/review`)
      .expect(201);

    expect(response.body.status).toBe(
      'UNDER_REVIEW',
    );
  });

  it('requests documents', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/cases/${caseId}/request-documents`,
      )
      .expect(201);

    expect(response.body.status).toBe(
      'NEED_DOCUMENT',
    );
  });

  it('creates a required document', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(`/cases/${caseId}/documents`)
      .send({
        type: 'NATIONAL_CARD',
        title: 'National Card',
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('REQUIRED');

    documentId = response.body.id;
  });

  it('rejects direct status tampering through PATCH', async () => {
    await request(app.getHttpServer())
      .patch(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .send({
        status: 'VERIFIED',
      })
      .expect(400);
  });

  it('keeps document status unchanged after status tampering attempt', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .expect(200);

    expect(response.body.status).toBe('REQUIRED');
  });

  it('rejects direct filePath tampering through PATCH', async () => {
    await request(app.getHttpServer())
      .patch(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .send({
        filePath:
          'tampered/fake-document.pdf',
      })
      .expect(400);
  });

  it('keeps filePath unchanged after filePath tampering attempt', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .expect(200);

    expect(response.body.filePath).toBeNull();
  });

  it('rejects direct rejectionReason tampering through PATCH', async () => {
    await request(app.getHttpServer())
      .patch(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .send({
        rejectionReason:
          'Tampered rejection reason',
      })
      .expect(400);
  });

  it('keeps rejectionReason unchanged after tampering attempt', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .expect(200);

    expect(
      response.body.rejectionReason,
    ).toBeNull();
  });

  it('rejects verification before upload', async () => {
    await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/verify`,
      )
      .expect(400);
  });

  it('rejects document rejection before upload', async () => {
    await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/reject`,
      )
      .send({
        rejectionReason:
          'Document is invalid',
      })
      .expect(400);
  });

  it('uploads the document through the dedicated workflow endpoint', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/cases/${caseId}/documents/${documentId}/upload`,
      )
      .send({
        filePath:
          'e2e-test/national-card.pdf',
      })
      .expect(201);

    expect(response.body.status).toBe(
      'UPLOADED',
    );

    expect(response.body.filePath).toBe(
      'e2e-test/national-card.pdf',
    );
  });

  it('verifies the uploaded document through the dedicated workflow endpoint', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .post(
        `/cases/${caseId}/documents/${documentId}/verify`,
      )
      .expect(201);

    expect(response.body.status).toBe(
      'VERIFIED',
    );

    expect(response.body.verifiedAt).toBeDefined();
  });

  it('rejects re-upload of an already VERIFIED document', async () => {
    await request(app.getHttpServer())
      .post(
        `/cases/${caseId}/documents/${documentId}/upload`,
      )
      .send({
        filePath:
          'e2e-test/tampered-reupload.pdf',
      })
      .expect(400);
  });

  it('keeps the verified document unchanged after re-upload attempt', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .get(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .expect(200);

    expect(response.body.status).toBe(
      'VERIFIED',
    );

    expect(response.body.filePath).toBe(
      'e2e-test/national-card.pdf',
    );
  });

  it('allows normal metadata update through PATCH', async () => {
    const response = await request(
      app.getHttpServer(),
    )
      .patch(
        `/cases/${caseId}/documents/${documentId}`,
      )
      .send({
        title: 'National Card - Updated',
      })
      .expect(200);

    expect(response.body.title).toBe(
      'National Card - Updated',
    );

    expect(response.body.status).toBe(
      'VERIFIED',
    );

    expect(response.body.filePath).toBe(
      'e2e-test/national-card.pdf',
    );
  });
});