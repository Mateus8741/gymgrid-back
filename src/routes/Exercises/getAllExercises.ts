import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function getAllExercises(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/exercises',
    {
      schema: {
        summary: 'Get all exercises',
        tags: ['Exercises'],
      },
    },
    async (request, reply) => {
      const exercise = await prisma.bodyPart.findMany()

      return reply.send({ exercise })
    },
  )
}
