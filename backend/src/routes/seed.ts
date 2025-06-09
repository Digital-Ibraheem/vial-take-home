import { FastifyInstance } from 'fastify';
import { runSeed } from '../../prisma/seed';

export default async function seedRoutes(fastify: FastifyInstance) {
  fastify.post('/seed', {
    schema: {
      tags: ['Utilities'],
      summary: 'Seed the database',
      description: 'Populate the database with sample form data. This will delete existing data and create new seed data.',
      response: {
        200: {
          description: 'Database seeded successfully',
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              example: 'success' 
            },
            message: { 
              type: 'string',
              example: 'Seed completed'
            }
          }
        },
        500: {
          description: 'Seeding failed',
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              example: 'error' 
            },
            message: { 
              type: 'string',
              example: 'Seeding failed: error details'
            }
          }
        }
      }
    },
    async handler(req, reply) {
      try {
        await runSeed();
        reply.send({ status: 'success', message: 'Seed completed' });
      } catch (err: any) {
        reply.status(500).send({ status: 'error', message: err.message });
      }
    }
  });
}
