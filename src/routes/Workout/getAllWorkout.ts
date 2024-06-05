// import { FastifyInstance } from 'fastify'
// import { prisma } from '../../prisma/prisma-client'

// export async function getAllWorkout(app: FastifyInstance) {
//   app.get(
//     '/workout',
//     {
//       schema: {
//         summary: 'Get all workouts',
//         tags: ['Workout'],
//       },
//     },
//     async (request, reply) => {
//       const workouts = await prisma.workout.findMany({
//         include: {
//           exercise: {
//             include: {
//               bodyPart: true,
//             },
//           },
//         },
//       })

//       return reply.send({ workouts })
//     },
//   )
// }

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

        const groupedWorkouts: {
          [key: string]: {
            workoutId: number
            exerciseId: number
            exerciseName: string
            createdAt: Date
          }[]
        } = {}

        workouts.forEach((workout) => {
          const bodyPartName = workout.exercise.bodyPart.name
          if (!groupedWorkouts[bodyPartName]) {
            groupedWorkouts[bodyPartName] = []
          }
          groupedWorkouts[bodyPartName].push({
            workoutId: workout.id,
            exerciseId: workout.exercise.id,
            exerciseName: workout.exercise.name,
            createdAt: workout.createdAt,
          })
        })

        const response = Object.keys(groupedWorkouts).map((bodyPartName) => ({
          bodyPart: bodyPartName,
          exercises: groupedWorkouts[bodyPartName],
        }))

        reply.status(200).send({ workouts: response })
      } catch (error) {
        console.error('Error fetching workouts:', error)
        reply.status(500).send({ error: 'Internal server error' })
      }
    },
  )
}
