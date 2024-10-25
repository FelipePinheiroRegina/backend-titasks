import 'dotenv/config'
import { z } from 'zod'

const waitEnvSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
	DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
	DATABASE_URL: z.string(),
	AUTH_SECRET: z.string(),
	SERVER_PORT: z.coerce.number().default(3333)  
})


const _env = waitEnvSchema.safeParse(process.env)

if(_env.success !== true) {
	console.error('Invalid environment variables', _env.error.format())
	throw new Error('Invalid environment variables.')
}

export const env = _env.data
