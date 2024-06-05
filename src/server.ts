/* eslint-disable prettier/prettier */
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import {
    ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod'
import { loginUser } from './routes/Auth/loginUser'
import { registerUser } from './routes/Auth/registerUser'

import { exercisesByBodyPart } from './routes/Exercises/exercisesByBodyPart'
import { getAllExercises } from './routes/Exercises/getAllExercises'
import { createWorkout } from './routes/Workout/createForm'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCookie)
app.register(fastifyJwt, { secret: 'supersecret-grid' })

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'GymGrid API',
      description: 'Rotas do GymGrid',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(registerUser)
app.register(loginUser)

app.register(getAllExercises)
app.register(exercisesByBodyPart)

app.register(createWorkout)

app.listen({ port: 3100, host: '0.0.0.0' }).then(() => {
  console.log('Server is running on port 3100')
})
