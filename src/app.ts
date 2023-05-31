import 'dotenv/config'

import fastify from 'fastify'
import { transactionRoutes } from './routes/transactions'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

// app.addHook('preHandler', async (request, reply) => {}) MIDDLEWARE GLOBAL
app.register(transactionRoutes, {
  prefix: 'transactions',
})
