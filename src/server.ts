import 'dotenv/config'

import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async (req, res) => {
  const transition = await knex('transactions').where('amount', 1000)

  return transition
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server listening on port: 3333')
  })
