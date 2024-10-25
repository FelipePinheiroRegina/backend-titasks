import { knex } from '../database'
import { Request, Response } from 'express'
import { DiskStorage } from '../providers/DiskStorage'

export class UserAvatarController {
	async update(req: Request, res: Response): Promise<void> {
		const user_id = req.user.id
        
		if (!req.file) {
			res.status(400).json({
				error: 'File not provided',
				message: 'Você precisa enviar um arquivo'
			})

			return
		}
      
		const avatarFilename = req.file.filename
        
		const diskStorage = new DiskStorage()

		const user = await knex('users').where({id: user_id}).first()

		if(!user) {
			res.status(401).json({
				error: 'Unauthorized',
				message: 'Apenas usuários autenticados podem mudar o avatar'
			})

			return
		}

		if(user.avatar) {
			await diskStorage.deleteFile(user.avatar)
		}

		const filename = await diskStorage.saveFile(avatarFilename)
		user.avatar = filename

		await knex('users').update(user).where({ id: user_id})

		res.status(201).json(user)
	}
}
