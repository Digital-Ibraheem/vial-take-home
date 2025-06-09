import build from './app'
import CORSConfig from '@fastify/cors'
import { FastifyInstance } from 'fastify'

const server: FastifyInstance = build({
  logger: {
    level: 'error',
  },
})

server.register(CORSConfig, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
})

const port = parseInt(process.env.PORT || '8080', 10)

server
  .listen({ port, host: '0.0.0.0' })
  .then(address => {
    console.log(`Server listening at ${address}`)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
