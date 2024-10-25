import { hash, compare } from 'bcryptjs'
import { Request, Response } from 'express'
import { knex } from '../database'
import { z } from 'zod'

export class UserController {
	async create(req: Request, res: Response): Promise<void> {
		const schemaBody = z.object({
			name: z.string(),
			email: z.string(),
			password: z.string()
		})

		const requestBody = schemaBody.safeParse(req.body)

		if(requestBody.success !== true) {
			res.status(400).json({
				error: 'Bad request',
				message: 'erro de tipo, todos parametros do body devem ser strings'
			})

			return
		}

		const { name, email, password } = requestBody.data

		try {
			// Verifica se o usuário já existe
			const checkUserExists = await knex('users').where({ email }).first()
            
			if(checkUserExists){
				res.status(409).json({
					error: 'Conflict',
					message: 'E-mail já existe'
				})

				return
			}

			// Hash da senha
			const hashPassword: string = await hash(password, 8)

			// Insere o novo usuário
			await knex('users').insert({
				name,
				email,
				password: hashPassword
			})

			res.status(201).json({
				status: 'success',
				message: 'User created'
			})

			return 

		} catch (error) {
			console.error(error)

			res.status(500).json({
				error: 'Internal Server Error',
				message: 'Erro no servidor, contate o desenvolvedor do sistema!'
			})

			return
		}
	}
    
	async update(req: Request, res: Response): Promise<void> {
		const user_id: number = req.user.id
		
		const schemaBody = z.object({
			name: z.string().optional(),
			email: z.string().optional(),
			oldPassword: z.string().optional(),
			newPassword: z.string().optional(),
			avatar: z.any().optional()
		})

		const requestBody = schemaBody.safeParse(req.body)

		if(requestBody.success !== true) {
			res.status(400).json({
				error: 'Bad request',
				message: 'erro de tipo, todos parametros do body devem ser strings'
			})

			return
		}

		const { name, email, oldPassword, newPassword, avatar } = requestBody.data

		// Busca o usuário pelo ID
		const user = await knex('users').where({ id: user_id }).first()

		if(!user){
			res.status(404).json({
				error: 'user not found',
				message: 'Usuário não encontrado'
			})

			return
		}

		// Verifica se o e-mail já está em uso por outro usuário
		const userUpdate = await knex('users').where({ email }).first()

		if(userUpdate && userUpdate.id !== user.id){
			res.status(409).json({
				status: 'unavailable',
				message: 'E-mail is already in use'
			})

			return
		}

		// Atualiza os dados do usuário
		user.name = name     ?? user.name
		user.email = email   ?? user.email
		user.avatar = avatar ?? user.avatar

		if(oldPassword && newPassword) {
			if(!oldPassword){
				res.status(401).json({
					error: 'Unauthorized',
					message: 'The oldpassword is required'
				})

				return
			}

			const checkedOldPassword: boolean = await compare(oldPassword, user.password)

			if(!checkedOldPassword){
				res.status(401).json({
					error: '',
					message: 'Old password is required'
				})

				return
			}

			user.password = await hash(newPassword, 8) 
		}

		await knex('users').update(user).where({ id: user_id })

		res.status(204).send()

		return
	}

	async index(req: Request, res: Response): Promise<void> {
		const schemaParams = z.object({
			id: z.coerce.number()
		})

		const __params = schemaParams.safeParse(req.params)

		if(__params.success !== true) {
			res.status(400).json({
				error: 'bad request',
				message: 'user id required'
			})

			return
		}

		const { id } = __params.data

		try {
			const user = await knex('users').where({ id }).first()

			res.status(201).json(user)
			return

		} catch (err) {
			console.log(err)
			res.status(500).json({
				error: 'internal server error',
				message: 'Erro do servidor, contate o administrador do sistema'
			})

			return
		}

	}	
}

