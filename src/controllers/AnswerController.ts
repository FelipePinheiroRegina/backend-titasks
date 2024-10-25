import { DiskStorage } from '../providers/DiskStorage'
import { knex } from '../database'
import { z } from 'zod'
import { Request, Response } from 'express'
import { randomUUID } from 'crypto'

export class AnswerController {
	async create(req: Request, res: Response): Promise<void> {
		const schemaBody = z.object({
			description: z.string()
		})

		const _body = schemaBody.safeParse(req.body)

		if(_body.success !== true) {
			res.status(401).json({
				error: 'bad request',
				message: 'description: string is required'
			})

			return
		}

		const { description } = _body.data

		const user_id: number = Number(req.user.id) 
		const task_id: number = Number(req.params.id) 
		const imageFileName: string = req.file ? req.file.filename : ''

		try { 
			let image: string = ''

			if (imageFileName !== '') {
				const diskStorage = new DiskStorage()
				image = await diskStorage.saveFile(imageFileName)
			}
			
			await knex('answers')
				.insert({
					id: randomUUID(),
					description,
					image,
					task_id,
					user_id
				})
    

			res.status(201).json({
				status: 'success',
				message: 'Tarefa respondida!'
			})

        	return

		} catch (error) {

			console.error('Erro ao responder tarefa', error)
			res.status(500).json({ 
				error: 'Internal Server Error', 
				message: 'Erro no servidor, contate o administrador do sistema'
			})

			return
		}
	}

	async index(req: Request, res: Response): Promise<void> {
		const task_id: number = Number(req.params.id)  

		try {
			const answers = await knex('answers').where({ task_id })

			res.status(200).json(answers)
			return

		} catch (err) {
			console.error(err)
			res.status(500).json({
				error: 'Internal Server Error',
				message: 'Erro do servidor, contate o administrador do sistema'
			})
		}
	}
}
