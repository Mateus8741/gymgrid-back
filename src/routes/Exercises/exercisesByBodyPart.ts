import { FastifyInstance } from 'fastify'

import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function exercisesByBodyPart(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/exercises/:name',
    {
      schema: {
        summary: 'Get all exercises by body part',
        params: z.object({
          name: z.string(),
        }),
        tags: ['Exercises'],
      },
    },
    async (request, reply) => {
      const { name } = request.params

      const exercises = await prisma.exercise.findMany({
        where: {
          bodyPart: {
            name,
          },
        },
      })

      return reply.send({ exercises })
    },
  )
}
