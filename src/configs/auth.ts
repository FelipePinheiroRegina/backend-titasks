import { env } from '../env'

export default {
	jwt: {
		secret: env.AUTH_SECRET || 'default',
		expiresIn: '1d'
	}
}