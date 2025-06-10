import fastify from 'fastify'

import formDataRoutes from './routes/form_data'
import queryRoutes from './routes/query'
import seedRoutes from './routes/seed'
import errorHandler from './errors'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Vial Form Data & Query API',
        description: 'API for managing form data and queries',
        version: '1.0.0',
      },
      host: 'localhost:8080',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    mode: 'dynamic',
    exposeRoute: true,
  })

  app.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    staticCSP: true,
  })

  app.register(formDataRoutes, { prefix: '/form-data' })
  app.register(queryRoutes, { prefix: '/query' })
  app.register(seedRoutes, { prefix: '/api' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
