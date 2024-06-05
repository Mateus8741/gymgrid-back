import bcrypt from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '../../prisma/prisma-client'
import { RegisterSchema } from '../../schema/RegisterSchema'

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
      schema: {
        body: RegisterSchema,
        summary: 'Register a new user',
        tags: ['User'],
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const alreadyExistsSameEmail = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        if (alreadyExistsSameEmail) {
          return reply.status(400).send({
            message: 'Email already exists',
          })
        }

        const hashedPassword = await bcrypt.hash(password, 8)

        await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        })

        return reply.status(201).send({
          message: 'User registered successfully',
        })
      } catch (error) {
        console.error('Error registering user:', error)

        return reply.status(500).send({
          message: 'Internal Server Error',
        })
      }
    },
  )
}
