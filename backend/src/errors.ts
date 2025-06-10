import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const errorHandler = (error: any, req: any, reply: any) => {
  if (error.statusCode) {
    reply.code(error.statusCode)
  }
  if (error instanceof PrismaClientKnownRequestError) {
    reply.code(404)
  }
  reply.send(error)
  return
}
export default errorHandler

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}


