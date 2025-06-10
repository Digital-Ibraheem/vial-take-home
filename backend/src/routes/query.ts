import { FastifyInstance } from 'fastify'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IQuery, ICreateQuery, IUpdateQuery } from './schemas/formData.interface'
import { ApiError } from '../errors'

const VALID_STATUSES = ['OPEN', 'RESOLVED'] as const

function isValidStatus(status: string): boolean {
  return VALID_STATUSES.includes(status as any)
}

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  // Create new query
  app.post<{
    Body: ICreateQuery
    Reply: IQuery
  }>('', {
    schema: {
      body: {
        type: 'object',
        required: ['title', 'formDataId'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          formDataId: { type: 'string' }
        }
      }
    },
    async handler(req, reply) {
      const { title, description, formDataId } = req.body
      const status: string = req.body.status || 'OPEN'
      
      if (!isValidStatus(status)) {
        throw new ApiError('Status must be either OPEN or RESOLVED', 400)
      }
      
      // Check if formData exists
      const formData = await prisma.formData.findUnique({
        where: { id: formDataId }
      })
      
      if (!formData) {
        throw new ApiError('FormData not found', 404)
      }

      const query = await prisma.query.create({
        data: {
          title,
          description,
          status: status as any,
          formDataId
        },
        include: {
          formData: true
        }
      })
      
      reply.code(201).send(query)
    },
  })

  // Update query
  app.patch<{
    Params: { id: string }
    Body: IUpdateQuery
    Reply: IQuery
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['OPEN', 'RESOLVED'] }
        }
      }
    },
    async handler(req, reply) {
      const { id } = req.params
      const updateData = req.body

      if (updateData.status && !isValidStatus(updateData.status)) {
        throw new ApiError('Status must be either OPEN or RESOLVED', 400)
      }

      const existingQuery = await prisma.query.findUnique({
        where: { id }
      })

      if (!existingQuery) {
        throw new ApiError('Query not found', 404)
      }

      const updatedQuery = await prisma.query.update({
        where: { id },
        data: {
          ...updateData,
          status: updateData.status as any,
          updatedAt: new Date()
        },
        include: {
          formData: true
        }
      })

      reply.send(updatedQuery)
    },
  })

  // Delete query
  app.delete<{
    Params: { id: string }
    Reply: { message: string }
  }>('/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    },
    async handler(req, reply) {
      const { id } = req.params

      const existingQuery = await prisma.query.findUnique({
        where: { id }
      })

      if (!existingQuery) {
        throw new ApiError('Query not found', 404)
      }

      await prisma.query.delete({
        where: { id }
      })

      reply.send({ message: 'Query deleted successfully' })
    },
  })
}

export default queryRoutes 