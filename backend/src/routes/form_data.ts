import { FastifyInstance } from 'fastify'
import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ICountedFormData } from './schemas/formData.interface'
import { ApiError } from '../errors'

async function formDataRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  app.get<{
    Reply: ICountedFormData
  }>('', {
    async handler(req, reply) {
      const formData = await prisma.formData.findMany({
        include: {
          queries: true
        }
      })
      reply.send({
        total: formData.length,
        formData,
      })
    },
  })
}

export default formDataRoutes
