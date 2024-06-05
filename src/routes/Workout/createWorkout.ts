import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { auth } from '../../middleware/verify-jwt'
import { prisma } from '../../prisma/prisma-client'

export async function createWorkout(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
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
        console.log('userId', userId)

        try {
          const student = await prisma.user.findUnique({
            where: { id: userId },
          })

          if (!student) {
            return reply.status(404).send({ error: 'Student not found' })
          }

          const workoutPromises = exerciseIds.map((exerciseId: number) =>
            prisma.workout.create({
              data: {
                exerciseId,
              },
            }),
          )

          await Promise.all(workoutPromises)

          reply.status(201).send({ message: 'Workout saved successfully' })
        } catch (error) {
          console.error('Error saving workout:', error)
          reply.status(500).send({ error: 'Internal server error' })
        }
      },
    )
}
