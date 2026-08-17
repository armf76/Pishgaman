import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Case Status Tampering E2E', () => {
  let app: INestApplication;

  let partyId: string;
  let caseId: string;

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
        displayName: 'Status Tampering E2E Applicant',
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
        title: 'Status Tampering E2E Test',
        description: 'Verify direct status manipulation is blocked',
      })
      .expect(201);

    caseId = response.body.id;

    expect(response.body.status).toBe('DRAFT');
  });

  it('blocks direct status change through PATCH', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/cases/${caseId}`)
      .send({
        status: 'APPROVED',
      })
      .expect(400);

    expect(response.body.message).toBe(
      'Case status must be changed through a workflow action',
    );
  });

  it('keeps the case in DRAFT after status tampering attempt', async () => {
    const response = await request(app.getHttpServer())
      .get(`/cases/${caseId}`)
      .expect(200);

    expect(response.body.status).toBe('DRAFT');
  });

  it('still allows legitimate non-status updates through PATCH', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/cases/${caseId}`)
      .send({
        title: 'Updated Legitimate Title',
        description: 'Updated legitimate description',
      })
      .expect(200);

    expect(response.body.status).toBe('DRAFT');
    expect(response.body.title).toBe(
      'Updated Legitimate Title',
    );
    expect(response.body.description).toBe(
      'Updated legitimate description',
    );
  });
});