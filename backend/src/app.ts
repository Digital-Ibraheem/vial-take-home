import fastify from 'fastify'

import formDataRoutes from './routes/form_data'
import queryRoutes from './routes/query'
import seedRoutes from './routes/seed'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  // Register Swagger for API documentation
  app.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Vial Form Data & Query API',
        description: 'API for managing form data and queries in the Vial application',
        version: '1.0.0',
      },
      host: 'localhost:8080',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Form Data', description: 'Form data related endpoints' },
        { name: 'Queries', description: 'Query management endpoints' },
        { name: 'Utilities', description: 'Utility endpoints like seeding' }
      ],
    },
    mode: 'dynamic',
    exposeRoute: true,
  })

  // Register Swagger UI
  app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })

  app.register(formDataRoutes, { prefix: '/form-data' })
  app.register(queryRoutes, { prefix: '/query' })
  app.register(seedRoutes, { prefix: '/api' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
