import { FastifyInstance } from 'fastify';
import * as supertest from 'supertest';
import createApp from '../../src/app';

const FORM_DATA_ID = 'e82ed0aa-e99d-4318-a346-898de9f8a529';

describe('Query Routes', () => {
  let app: FastifyInstance;
  let request: any;

  beforeAll(async () => {
    app = createApp();
    await app.ready();
    request = supertest(app.server);
  });

  afterAll(async () => {
    // Clean up test queries - delete all queries for the test form data
    try {
      const formDataResponse = await request.get('/form-data');
      const testFormData = formDataResponse.body.data.formData.find(
        (fd: any) => fd.id === FORM_DATA_ID
      );
      
      if (testFormData?.queries) {
        for (const query of testFormData.queries) {
          await request.delete(`/query/${query.id}`);
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
    
    await app.close();
  });

  describe('POST /query', () => {
    it('should create a new query with default status OPEN', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Test Query',
          description: 'Test description',
          formDataId: FORM_DATA_ID
        })
        .expect(201);

      expect(response.body.statusCode).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Query');
      expect(response.body.data.description).toBe('Test description');
      expect(response.body.data.status).toBe('OPEN');
      expect(response.body.data.formDataId).toBe(FORM_DATA_ID);
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should create a new query with explicit OPEN status', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Explicit OPEN Status Query',
          description: 'Testing explicit status',
          formDataId: FORM_DATA_ID,
          status: 'OPEN'
        })
        .expect(201);

      expect(response.body.data.status).toBe('OPEN');
    });

    it('should create a new query with RESOLVED status', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Resolved Query',
          description: 'Testing resolved status',
          formDataId: FORM_DATA_ID,
          status: 'RESOLVED'
        })
        .expect(201);

      expect(response.body.data.status).toBe('RESOLVED');
    });

    it('should reject query with invalid status', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Invalid Status Query',
          description: 'Testing invalid status',
          formDataId: FORM_DATA_ID,
          status: 'INVALID_STATUS'
        })
        .expect(400);

      expect(response.body.message).toContain('Status must be either OPEN or RESOLVED');
    });

    it('should reject query with missing title', async () => {
      await request
        .post('/query')
        .send({
          description: 'Missing title',
          formDataId: FORM_DATA_ID
        })
        .expect(400);
    });

    it('should reject query with missing formDataId', async () => {
      await request
        .post('/query')
        .send({
          title: 'Missing FormData ID',
          description: 'Testing missing formDataId'
        })
        .expect(400);
    });

    it('should reject query with non-existent formDataId', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Non-existent FormData',
          description: 'Testing non-existent formDataId',
          formDataId: '00000000-0000-0000-0000-000000000000'
        })
        .expect(404);

      expect(response.body.message).toContain('FormData not found');
    });

    it('should create query without description (optional field)', async () => {
      const response = await request
        .post('/query')
        .send({
          title: 'Query without description',
          formDataId: FORM_DATA_ID
        })
        .expect(201);

      expect(response.body.data.description).toBeNull();
    });
  });

  describe('PATCH /query/:id', () => {
    let queryId: string;

    beforeEach(async () => {
      // Create a query to update
      const createResponse = await request
        .post('/query')
        .send({
          title: 'Query to Update',
          description: 'Original description',
          formDataId: FORM_DATA_ID,
          status: 'OPEN'
        });
      
      queryId = createResponse.body.data.id;
    });

    it('should update query title', async () => {
      const response = await request
        .patch(`/query/${queryId}`)
        .send({
          title: 'Updated Title'
        })
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
    });

    it('should update query description', async () => {
      const response = await request
        .patch(`/query/${queryId}`)
        .send({
          description: 'Updated description'
        })
        .expect(200);

      expect(response.body.data.description).toBe('Updated description');
    });

    it('should update query status from OPEN to RESOLVED', async () => {
      const response = await request
        .patch(`/query/${queryId}`)
        .send({
          status: 'RESOLVED'
        })
        .expect(200);

      expect(response.body.data.status).toBe('RESOLVED');
    });

    it('should update multiple fields at once', async () => {
      const response = await request
        .patch(`/query/${queryId}`)
        .send({
          title: 'Multi-field Update',
          description: 'Updated in bulk',
          status: 'RESOLVED'
        })
        .expect(200);

      expect(response.body.data.title).toBe('Multi-field Update');
      expect(response.body.data.description).toBe('Updated in bulk');
      expect(response.body.data.status).toBe('RESOLVED');
    });

    it('should reject update with invalid status', async () => {
      const response = await request
        .patch(`/query/${queryId}`)
        .send({
          status: 'INVALID_STATUS'
        })
        .expect(400);

      expect(response.body.message).toContain('Status must be either OPEN or RESOLVED');
    });

    it('should return 404 for non-existent query', async () => {
      const response = await request
        .patch('/query/00000000-0000-0000-0000-000000000000')
        .send({
          title: 'Update non-existent'
        })
        .expect(404);

      expect(response.body.message).toContain('Query not found');
    });

    it('should update updatedAt timestamp', async () => {
      // Get the original timestamp from the created query (in beforeEach)
      const originalCreationResponse = await request
        .post('/query')
        .send({
          title: 'Original Timestamp Query',
          formDataId: FORM_DATA_ID
        });
      
      const originalTimestamp = new Date(originalCreationResponse.body.data.updatedAt).getTime();
      const createdQueryId = originalCreationResponse.body.data.id;
      
      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updateResponse = await request
        .patch(`/query/${createdQueryId}`)
        .send({
          title: 'Updated for timestamp test'
        })
        .expect(200);

      const updatedTimestamp = new Date(updateResponse.body.data.updatedAt).getTime();
      
      expect(updatedTimestamp).toBeGreaterThan(originalTimestamp);
    });
  });

  describe('DELETE /query/:id', () => {
    let queryId: string;

    beforeEach(async () => {
      // Create a query to delete
      const createResponse = await request
        .post('/query')
        .send({
          title: 'Query to Delete',
          description: 'Will be deleted',
          formDataId: FORM_DATA_ID
        });
      
      queryId = createResponse.body.data.id;
    });

    it('should delete an existing query', async () => {
      const response = await request
        .delete(`/query/${queryId}`)
        .expect(200);

      expect(response.body.message).toBe('success');
    });

    it('should return 404 when trying to delete non-existent query', async () => {
      const response = await request
        .delete('/query/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.message).toContain('Query not found');
    });

    it('should actually delete the query from database', async () => {
      // Delete the query
      await request
        .delete(`/query/${queryId}`)
        .expect(200);

      // Try to update the deleted query - should return 404
      await request
        .patch(`/query/${queryId}`)
        .send({ title: 'Should not work' })
        .expect(404);
    });
  });

  describe('Integration with FormData', () => {
    it('should include queries in FormData response', async () => {
      // Create a query
      const queryResponse = await request
        .post('/query')
        .send({
          title: 'Integration Test Query',
          description: 'Testing integration',
          formDataId: FORM_DATA_ID
        })
        .expect(201);

      // Get form data and check if query is included
      const formDataResponse = await request
        .get('/form-data')
        .expect(200);

      const targetFormData = formDataResponse.body.data.formData.find(
        (fd: any) => fd.id === FORM_DATA_ID
      );

      expect(targetFormData).toBeDefined();
      expect(targetFormData.queries).toBeDefined();
      expect(Array.isArray(targetFormData.queries)).toBe(true);
      
      const createdQuery = targetFormData.queries.find(
        (q: any) => q.id === queryResponse.body.data.id
      );
      expect(createdQuery).toBeDefined();
      expect(createdQuery.title).toBe('Integration Test Query');
    });
  });
}); 