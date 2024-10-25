import authConfig from '../configs/auth'
import { knex } from '../database'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Request, Response} from 'express'
import { z } from 'zod'

interface User {
	id: number,
	name: string,
	email: string,
	password: string,
	avatar: string,
	role: string,
	created_at: string,
	updated_at: string
}

export class SessionController {
	async create(req: Request, res: Response): Promise<void> {

		const schemaBody = z.object({
			email: z.string(),
			password: z.string()
		})

		const requestBody = schemaBody.safeParse(req.body)

		if(requestBody.success !== true) {
			res.status(400).json({
				error: 'Bad request',
				message: 'erro de tipo, todos parametros do body devem ser strings e são obrigatórios'
			})

			return
		}

		const { email, password } = requestBody.data

		const user: User | undefined = await knex('users').where({ email }).first()

		if(!user) {
			res.status(401).json({
				error: 'Unauthorized',
				message: 'Email ou senha inválida(o)'
			})

			return
		}

		const validPassword = await compare(password, user.password)

		if(!validPassword) {
			res.status(401).json({
				error: 'Unauthorized',
				message: 'Email ou senha inválida(o)'
			})

			return
		}

		const { secret, expiresIn } = authConfig.jwt
		const token = sign({}, secret, {
			subject: String(user.id),
			expiresIn
		})

		const necessaryUserData = { 
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			avatar: user.avatar,
		}

		res.json({
			user: necessaryUserData,
			token
		})
	}
}

