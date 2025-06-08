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

  const log = app.log.child({ component: 'queryRoutes' })

  // POST /query - Create a new query
  app.post<{
    Body: ICreateQuery
    Reply: IQuery
  }>('', {
    schema: {
      body: {
        type: 'object',
        required: ['title', 'status', 'formDataId'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string' },
          formDataId: { type: 'string' }
        }
      }
    },
    async handler(req, reply) {
      log.debug('create query', { body: req.body })
      try {
        const { title, description, status, formDataId } = req.body
        
        if (!isValidStatus(status)) {
          throw new ApiError('Status must be either OPEN or RESOLVED', 400)
        }
        
        // Verify formData exists
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
            status,
            formDataId
          },
          include: {
            formData: true
          }
        })
        
        reply.code(201).send(query)
      } catch (err: any) {
        log.error({ err }, err.message)
        if (err instanceof ApiError) throw err
        throw new ApiError('Failed to create query', 400)
      }
    },
  })

  // PATCH /query/:id - Update a query
  app.patch<{
    Params: { id: string }
    Body: IUpdateQuery
    Reply: IQuery
  }>('/:id', {
    async handler(req, reply) {
      log.debug({ queryId: req.params.id }, 'update query')
      try {
        const { id } = req.params
        const updateData = req.body

        if (updateData.status && !isValidStatus(updateData.status)) {
          throw new ApiError('Status must be either OPEN or RESOLVED', 400)
        }

        // Check if query exists
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
            updatedAt: new Date()
          },
          include: {
            formData: true
          }
        })

        reply.send(updatedQuery)
      } catch (err: any) {
        log.error({ err }, err.message)
        if (err instanceof ApiError) throw err
        throw new ApiError('Failed to update query', 400)
      }
    },
  })

  // DELETE /query/:id - Delete a query (Bonus)
  app.delete<{
    Params: { id: string }
    Reply: { message: string }
  }>('/:id', {
    async handler(req, reply) {
      log.debug({ queryId: req.params.id }, 'delete query')
      try {
        const { id } = req.params

        // Check if query exists
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
      } catch (err: any) {
        log.error({ err }, err.message)
        if (err instanceof ApiError) throw err
        throw new ApiError('Failed to delete query', 400)
      }
    },
  })
}

export default queryRoutes 