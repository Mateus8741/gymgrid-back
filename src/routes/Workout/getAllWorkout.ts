import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'

export async function getWorkouts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/workouts',
    {
      schema: {
        summary: 'Get all workouts with exercises grouped by body parts',
        tags: ['Workout'],
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      try {
        const workouts = await prisma.workout.findMany({
          where: { userId },
          include: {
            exercise: {
              include: {
                bodyPart: true,
              },
            },
          },
        })

        reply.status(200).send({
          workouts: workouts.map((workout) => {
            return {
              id: workout.id,
              exerciseId: workout.exerciseId,
              createdAt: workout.createdAt,
              userId: workout.userId,
              exercise: {
                name: workout.exercise.name,
                bodyPartId: workout.exercise.bodyPartId,
                bodyPartName: workout.exercise.bodyPart.name,
              },
            }
          }),
        })
      } catch (error) {
        console.error('Error fetching workouts:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    },
  )
}
