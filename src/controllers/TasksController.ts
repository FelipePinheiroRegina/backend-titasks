import { knex } from '../database'
import { DiskStorage } from '../providers/DiskStorage'
import { Request, Response } from 'express'
import { z } from 'zod'

interface Task {
	id: number,
	title: string,
	description: string,
	status: boolean,
	image: string,
	created_at: string,
	updated_at: string,
	user_id: number
}

export class TasksController {
	async create(req: Request, res: Response): Promise<void>{
		const schemaBody = z.object({
			title: z.string(),
			description: z.string(),
			image: z.string().optional()
		})

		const _body = schemaBody.safeParse(req.body)

		if(_body.success !== true) {
			res.status(401).json({
				error: 'bad request',
				message: 'title e description são strings, e image File'
			})

			return
		}

		const { title, description } = _body.data

		const user_id: number = req.user.id
		const imageFileName: string = req.file ? req.file.filename : ''

		try { 
			let image: string = ''

			if (imageFileName !== '') {
				const diskStorage = new DiskStorage()
				image = await diskStorage.saveFile(imageFileName)
			}
			
			await knex('tasks')
				.insert({
					title,
					description,
					image,
					user_id
				})
    

			res.status(201).json({
				status: 'success',
				message: 'Tarefa criada!'
			})

        	return

		} catch (error) {

			console.error('Erro ao criar tarefa', error)
			res.status(500).json({ 
				error: 'Internal Server Error', 
				message: 'Erro no servidor, contate o administrador do sistema'
			})

			return
		}
	}

	async index(req: Request, res: Response) {
		const schemaQuery = z.object({
			search: z.string().optional(),
			status: z.preprocess((val) => {
				if (typeof val === 'string') {
				  return val.toLowerCase() === 'true' // Converte a string "true"/"false" corretamente
				}
				return Boolean(val) // Para outros tipos, retorna como booleano
			  }, z.boolean()),
		})
        
		const _query = schemaQuery.safeParse(req.query) // Usar req.query para query parameters
        
		if (_query.success !== true) {
			res.status(400).json({
				error: 'bad request',
				message: 'search deve ser string, e status, boolean.'
			})
        
			return
		}
        
		const { search, status } = _query.data
    
		let query = knex('tasks').where({ status }).orderBy('created_at', 'asc')
        
		// Se search existir, adicionar condição LIKE
		if (search) {
			query = query.where(function() {
				this.where('title', 'like', `%${search}%`)
					.orWhere('description', 'like', `%${search}%`)
			})
		}
        
		// Executar a query e retornar os resultados
		query.then(tasks => {
			res.status(200).json(tasks)
		}).catch(error => {
			console.error('Error fetching tasks:', error)
			res.status(500).json({ error: 'Internal Server Error' })
		}) 
	}

	async show(req: Request, res: Response): Promise<void> {
		const id: number = Number(req.params.id)

		try {
			const tasks = await knex('tasks').where({ id }).first()

			res.status(200).json(tasks)
		} catch (err) {
			console.log(err)
			res.status(500).json({
				error: 'server error',
				message: 'internal server error, contate o desenvolvedor do sistema.'
			})
		}
	}

	async delete(req: Request, res: Response): Promise<void> {
		const id: number = Number(req.params.id)
		const user_id = req.user.id

		try {
			const task: Task | undefined = await knex('tasks').where({ id }).first()

			if(!task) {
				res.status(404).json({
					error: 'not found',
					message: 'Impossivel de encontrar esta task'
				})
				
				return
			}

			if(task.user_id !== user_id) {
				res.status(401).json({
					error: 'Unauthorized',
					message: 'Você não tem permissão para deletar tarefas de outros usuários'
				})

				return
			}

			if(task.image) {
				const diskStorage = new DiskStorage()
				await diskStorage.deleteFile(task.image)
			}

			await knex('tasks').where({ id }).del()

			res.status(204).json()

			return
		} catch (err) {
			console.error(err)
			res.status(500).json({ 
				error: 'Internal Server Error',
				message: 'Internal Server Error'
			})

			return
		}
	}

	async update(req: Request, res: Response): Promise<void> {
		const schemaBody = z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			status: z.boolean().optional()
		})

		const _body = schemaBody.safeParse(req.body)

		if(_body.success !== true) {
			res.status(401).json({
				error: 'bad request',
				message: 'title e description são strings e status um boolean.'
			})

			return
		}

		const { title, description, status } = _body.data

		const id: number = Number(req.params.id)

		try {
			const task: Task | undefined = await knex('tasks').where({ id }).first()

			if(!task) {
				res.status(404).json({
					error: 'not found',
					message: 'Impossivel de encontrar esta task'
				})
				
				return
			}

			task.title = title ?? task.title
			task.description = description ?? task.description
			task.status = status !== undefined ? status : task.status
			task.updated_at = new Date().toISOString() // Atualizando a data atual
			
			await knex('tasks').where({ id })
				.update(task)

			res.status(204).json({})
			return

		} catch (err) {
			console.error(err)
			res.status(500).json({ 
				error: 'Internal Server Error',
				message: 'Contate o desenvolvedor do sistema' 
			})
		}
	}

	async updateStatus(req: Request, res: Response): Promise<void> {
		const schemaParams = z.object({
			task_id: z.coerce.number(),
		})
	
		const _params = schemaParams.safeParse(req.params)
	
		if (!_params.success) {
			res.status(400).json({
				error: 'Bad Request',
				message: 'task_id is required and must be a number',
			})
			return
		}
	
		const { task_id } = _params.data
	
		try {
			const task = await knex('tasks').where({ id: task_id }).first()
	
			if (!task) {
				res.status(404).json({
					error: 'Not Found',
					message: 'Unable to find this task',
				})

				return
			}
	
			await knex('tasks')
				.where({ id: task_id })
				.update({
					status: true,
					updated_at: new Date().toISOString(),
				})
	
			// Use `send()` instead of `json({})` when no content is needed
			res.status(204).send()
		} catch (err) {
			console.error(err)
			res.status(500).json({
				error: 'Internal Server Error',
				message: 'Please contact the system developer',
			})
		}
	}

}

