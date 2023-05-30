import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto from 'crypto'

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    // title, amount, type: credit or debit
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount - 1,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return {
      transactions,
    }
  })
  app.get('/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .select()
      .where({ id })
      .first()

    return {
      transaction,
    }
  })
}
