import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import crypto, { randomUUID } from 'crypto'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

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

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })

  app.get(
    '/',
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where({ session_id: sessionId })
        .select()

      return {
        transactions,
      }
    },
  )
  app.get('/:id', { preHandler: [checkSessionIdExist] }, async (request) => {
    const { sessionId } = request.cookies

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const transaction = await knex('transactions')
      .where({ id, session_id: sessionId })
      .select()
      .first()

    return {
      transaction,
    }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where({ session_id: sessionId })
        .sum('amount', { as: 'amount' })
        .first()

      return {
        summary,
      }
    },
  )
}
