import { z } from 'zod'

const environmentSchema = z.object({
	DATABASE_URL: z.url(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.coerce.number().int().positive(),
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	TMDB_API_KEY: z.string(),
})

export type Environment = z.infer<typeof environmentSchema>

export function validateEnvironment(config: Record<string, unknown>): Environment {
	return environmentSchema.parse(config)
}
