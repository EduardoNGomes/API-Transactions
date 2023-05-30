import 'dotenv/config'

import fastify from 'fastify'
import { env } from './env'
import { transactionRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

// app.addHook('preHandler', async (request, reply) => {}) MIDDLEWARE GLOBAL
app.register(transactionRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server listening on port: 3333')
  })
