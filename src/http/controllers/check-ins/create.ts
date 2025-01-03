import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const checkInBodySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180
        }),
    })

    const checkInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })
    const { gymId } = checkInParamsSchema.parse(request.params)

    const { latitude, longitude } = checkInBodySchema.parse(request.body)

    const createCheckInUseCase = makeCheckInUseCase()
    await createCheckInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return reply.status(201).send()
}
