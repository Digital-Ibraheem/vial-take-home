import { FastifyInstance } from 'fastify';
import * as supertest from 'supertest';
import createApp from '../../src/app';

describe('FormData Routes', () => {
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
        (fd: any) => fd.id === 'e82ed0aa-e99d-4318-a346-898de9f8a529'
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

  describe('GET /form-data', () => {
    it('should return all form data with queries included', async () => {
      const response = await request
        .get('/form-data')
        .expect(200);

      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data.formData)).toBe(true);
      expect(response.body.data.formData.length).toBeGreaterThan(0);
      
      // Check that queries are included
      const formDataWithQueries = response.body.data.formData.find((fd: any) => fd.queries?.length > 0);
      if (formDataWithQueries) {
        expect(formDataWithQueries.queries).toBeDefined();
        expect(Array.isArray(formDataWithQueries.queries)).toBe(true);
        expect(formDataWithQueries.queries[0]).toHaveProperty('id');
        expect(formDataWithQueries.queries[0]).toHaveProperty('title');
        expect(formDataWithQueries.queries[0]).toHaveProperty('status');
      }
    });

    it('should return form data with proper structure', async () => {
      const response = await request
        .get('/form-data')
        .expect(200);

      const formData = response.body.data.formData[0];
      expect(formData).toHaveProperty('id');
      expect(formData).toHaveProperty('question');
      expect(formData).toHaveProperty('answer');
      expect(formData).toHaveProperty('queries');
      expect(typeof formData.id).toBe('string');
      expect(typeof formData.question).toBe('string');
      expect(typeof formData.answer).toBe('string');
    });
  });
}); 