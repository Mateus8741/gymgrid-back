import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../../prisma/prisma-client'

export async function createWorkout(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/workout',
    {
      schema: {
        body: z.object({
          exerciseIds: z.array(z.number()),
        }),
        summary: 'Create a new workout',
        tags: ['Workout'],
      },
    },
    async (request, reply) => {
      const { exerciseIds } = request.body

      const userId = await request.getCurrentUserId()

      try {
        const student = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (!student) {
          return reply.status(404).send({ error: 'Student not found' })
        }

        exerciseIds.forEach(async (element) => {
          await prisma.workout.create({
            data: {
              exerciseId: element,
              userId,
            },
          })
        })

        reply.status(201).send({ message: 'Workout saved successfully' })
      } catch (error) {
        console.error('Error saving workout:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    },
  )
}
