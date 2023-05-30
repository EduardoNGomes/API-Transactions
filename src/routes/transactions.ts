import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transition = await knex('transactions').where('amount', 1000)

    return transition
  })
}
