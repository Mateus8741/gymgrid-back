import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    const bodyParts = [
      { name: 'Chest' },
      { name: 'Back' },
      { name: 'Biceps' },
      { name: 'Forearms' },
      { name: 'Legs' },
      { name: 'Thighs/Glutes' },
      { name: 'Shoulders' },
      { name: 'Trapezius' },
      { name: 'Triceps' },
      { name: 'Abdomen' },
    ]

    const chestExercises = [
      'SUPINO RETO',
      'HALTERES',
      'SUPINO INCLINADO',
      'SUPINO DECLINADO',
      'SUPINO ARTICULADO',
      'CRUCIFIXO RETO',
      'VOADOR',
      'HAMMER',
      'HALTERES UNILATERAL INCLINADO',
      'PECK DECK',
      'UNILATERAL CA',
      'OMBRO CROSS',
      'PULL OVER',
    ]

    const backExercises = [
      'BARRA FIXA',
      'GRAVITON',
      'CROSS',
      'CRUCIFIXO INVERTIDO',
      'PULL DOWN',
      'PUXADOR ALTO',
      'PUXADOR BAIXO',
      'PUXADOR ALTO ARTICULADO',
      'UNIL',
      'REMADA ARTICULADA',
      'UNILATERAL',
      'REMADA CAVALINHO',
      'CURVADA',
      'VOADOR INVERSO',
      'PECK DECK',
    ]

    const bicepsExercises = [
      'BANCO SCOTT',
      'HALTER',
      'ROSCA NEGATIVA',
      'ROSCA ALTERNADA 21',
      'ROSCA 21',
      'ROSCA CONCENTRADA',
      'SCOTT',
      'ROSCA DIRETA',
      'BARRA H',
      'ROSCA MARTELO',
      'BARRA W',
      'BARRA',
    ]

    const forearmsExercises = [
      'FLEXÃO DE PUNHO',
      'BARRA',
      'CROSS',
      'PRONADO',
      'SUPINADO',
    ]

    const legsExercises = [
      'HACK',
      'LEG PRESS',
      'ABDUZIDO',
      'UNILATERAL',
      'PANTURRILHA SENTADA',
      'PANTURRILHA PÊNDULO',
      'ABDUZIDO',
      'UNILATERAL',
      'DORSIFLEXÃO',
      'MÁQUINA',
    ]

    const thighsGlutesExercises = [
      'AGACHAMENTO ISOMETRICO',
      'PAREDE',
      'AGACHAMENTO SMITH',
      'AGACHAMENTO FRONTAL',
      'AGACHAMENTO LIVRE',
      'AGACHAMENTO SUMÔ',
      'AGACHAMENTO SMITH',
      'AGACHAMENTO PÊNDULO',
      'UNIL',
      'AGACHAMENTO COM HALTERES',
      'AGACHAMENTO FRONTAL',
      'LEVANTAMENTO TERRA',
      'ABDUZIDO',
      'LEVANTAMENTO TERRA - BARRA HEXAGONAL',
      'EXTENSÃO DE QUADRIL',
      'ABDUÇÃO',
      'CADEIRA ABDUTORA',
      'ABDUÇÃO',
      'CROSS',
      'ELEVAÇÃO PÉLVICA',
      'MÁQUINA',
      'BÚLGARO',
      'AVANÇO',
      'AFUNDO',
      'CADEIRA EXTENSORA',
      'GRAVITON',
      'BILATERAL',
      'FLEXÃO DE QUADRIL',
      'FLEXÃO DE JOELHO',
      'FLEXORA DEITADA',
      'GOOD MORNING',
      'STIFF',
      'HALTER',
      'BARRA',
      'UNILATERAL',
      'ANILHA',
    ]

    const shouldersExercises = [
      'BARRA',
      'HALTER',
      'SMITH',
      'ELEVAÇÃO LATERAL',
      'ELEVAÇÃO FRONTAL',
      'HIPEREXTENSÃO DE OMBRO',
      'ROTAÇÃO INTERNA E EXTERNA',
      'LATERAL + ADUÇÃO + EXTENSÃO',
      'ARNOLD',
    ]

    const trapeziusExercises = [
      'CROSS',
      'BARRA',
      'ANILHA',
      'HALTER',
      'ABDUÇÃO/ADUÇÃO DA ESCÁPULA',
    ]

    const tricepsExercises = [
      'TESTA',
      'FRANCÊS',
      'CROSS',
      'COICE',
      'BANCO',
      'CORDA',
      'BARRA V',
      'DIAGONAL',
      'PEGADA NEUTRA',
      'UNILATERAL',
      'INVERTIDO',
      'HALTER',
      'PARALELA',
      'GRAV.',
    ]

    const abdomenExercises = [
      'CANIVETE',
      'ROLINHO',
      'ELEVAÇÃO DE PERNAS',
      'PRANCHA',
      'BOLA',
      'LATERAL',
      'MILITAR',
      'OBLÍQUO COM ROTAÇÃO',
      'INCLINAÇÃO',
      'EXTENSÃO LOMBAR',
      'SOLO',
      'FLEXÃO DE TRONCO',
      'CRUZADO',
    ]

    const exercisesByBodyPart: Record<string, string[]> = {
      Chest: chestExercises,
      Back: backExercises,
      Biceps: bicepsExercises,
      Forearms: forearmsExercises,
      Legs: legsExercises,
      'Thighs/Glutes': thighsGlutesExercises,
      Shoulders: shouldersExercises,
      Trapezius: trapeziusExercises,
      Triceps: tricepsExercises,
      Abdomen: abdomenExercises,
    }

    for (const part of bodyParts) {
      let bodyPart = await prisma.bodyPart.findUnique({
        where: { name: part.name },
      })

      if (!bodyPart) {
        bodyPart = await prisma.bodyPart.create({
          data: {
            name: part.name,
          },
        })
      }

      const exercises =
        exercisesByBodyPart[part.name as keyof typeof exercisesByBodyPart]

      for (const exerciseName of exercises) {
        const existingExercise = await prisma.exercise.findUnique({
          where: { name: exerciseName },
        })

        if (!existingExercise) {
          await prisma.exercise.create({
            data: {
              name: exerciseName,
              bodyPart: {
                connect: { id: bodyPart.id },
              },
            },
          })
        }
      }
    }

    await prisma.$disconnect()
    console.log('Exercícios criados com sucesso!')
  } catch (error) {
    console.error('Erro ao criar os exercícios:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

seedDatabase()
